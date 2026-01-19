import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { ReadingProgress, LibraryItem } from "@/lib/db/models";
import { UserStats } from "@/lib/db/models/UserStats";
import { verifyToken } from "@/lib/auth/jwt";

// Helper to check if two dates are on the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

// Helper to check if two dates are consecutive days
function isConsecutiveDay(prev: Date, current: Date): boolean {
  const oneDay = 24 * 60 * 60 * 1000;
  const prevDate = new Date(
    prev.getFullYear(),
    prev.getMonth(),
    prev.getDate()
  );
  const currentDate = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate()
  );
  return currentDate.getTime() - prevDate.getTime() === oneDay;
}

// Get reading progress for a book
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    await connectToDatabase();

    if (bookId) {
      // Get progress for specific book
      const progress = await ReadingProgress.findOne({
        userId: payload.userId,
        bookId,
      });
      return NextResponse.json({ success: true, data: progress });
    }

    // Get all progress for user
    const allProgress = await ReadingProgress.find({ userId: payload.userId });
    return NextResponse.json({ success: true, data: allProgress });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get progress" },
      { status: 500 }
    );
  }
}

// Update reading progress with session tracking
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const {
      bookId,
      currentPage,
      totalPages,
      // Optional session data for detailed tracking
      sessionStartPage,
      sessionDurationMinutes,
    } = await request.json();

    if (!bookId || !currentPage || !totalPages) {
      return NextResponse.json(
        {
          success: false,
          error: "Book ID, current page, and total pages are required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const now = new Date();
    const completed = currentPage >= totalPages;

    // Get existing progress to track session
    const existingProgress = await ReadingProgress.findOne({
      userId: payload.userId,
      bookId,
    });

    const pagesRead = sessionStartPage
      ? Math.max(0, currentPage - sessionStartPage)
      : existingProgress
      ? Math.max(0, currentPage - existingProgress.currentPage)
      : currentPage - 1;

    // Build session data if we have duration info
    const sessionData = sessionDurationMinutes
      ? {
          startedAt: new Date(
            now.getTime() - sessionDurationMinutes * 60 * 1000
          ),
          endedAt: now,
          startPage: sessionStartPage || existingProgress?.currentPage || 1,
          endPage: currentPage,
          pagesRead,
          durationMinutes: sessionDurationMinutes,
        }
      : null;

    // Update progress with session tracking
    const updateData: Record<string, unknown> = {
      userId: payload.userId,
      bookId,
      currentPage,
      totalPages,
      lastReadAt: now,
      completed,
      lastSessionEndedAt: now,
      daysInactive: 0,
    };

    if (completed && !existingProgress?.completed) {
      updateData.completedAt = now;
    }

    if (!existingProgress) {
      updateData.firstReadAt = now;
    }

    if (sessionData) {
      updateData.$push = { readingSessions: sessionData };
      updateData.$inc = { totalTimeSpentMinutes: sessionDurationMinutes };
    }

    const progress = await ReadingProgress.findOneAndUpdate(
      { userId: payload.userId, bookId },
      sessionData
        ? {
            $set: { ...updateData, $push: undefined, $inc: undefined },
            $push: { readingSessions: sessionData },
            $inc: { totalTimeSpentMinutes: sessionDurationMinutes },
          }
        : updateData,
      { upsert: true, new: true }
    );

    // Update library item status
    await LibraryItem.findOneAndUpdate(
      { userId: payload.userId, bookId },
      {
        status: completed ? "completed" : "reading",
        userId: payload.userId,
        bookId,
      },
      { upsert: true }
    );

    // Update user stats for streaks and activity tracking
    await updateUserStats(
      payload.userId,
      bookId,
      pagesRead,
      sessionDurationMinutes || 0,
      completed && !existingProgress?.completed
    );

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

// Update user stats including streak tracking
async function updateUserStats(
  userId: string,
  bookId: string,
  pagesRead: number,
  minutesRead: number,
  bookCompleted: boolean
) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const userStats = await UserStats.findOne({ userId });

  if (!userStats) {
    // Create new stats for user
    await UserStats.create({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastReadDate: today,
      streakStartDate: today,
      totalBooksCompleted: bookCompleted ? 1 : 0,
      totalPagesRead: pagesRead,
      totalReadingTimeMinutes: minutesRead,
      readingHistory: [
        {
          date: today,
          pagesRead,
          minutesRead,
          booksRead: [bookId],
        },
      ],
      lastActivityAt: now,
    });
    return;
  }

  // Update streak logic
  let newStreak = userStats.currentStreak;
  let streakStartDate = userStats.streakStartDate;

  if (userStats.lastReadDate) {
    const lastRead = new Date(userStats.lastReadDate);

    if (isSameDay(lastRead, now)) {
      // Same day, streak unchanged
    } else if (isConsecutiveDay(lastRead, now)) {
      // Consecutive day, increment streak
      newStreak += 1;
    } else {
      // Streak broken, reset
      newStreak = 1;
      streakStartDate = today;
    }
  } else {
    // First time reading
    newStreak = 1;
    streakStartDate = today;
  }

  const longestStreak = Math.max(userStats.longestStreak, newStreak);

  // Update or add to today's reading history
  const todayHistory = userStats.readingHistory.find((h: { date: Date }) =>
    isSameDay(new Date(h.date), today)
  );

  if (todayHistory) {
    // Update today's entry
    await UserStats.updateOne(
      { userId, "readingHistory.date": todayHistory.date },
      {
        $set: {
          currentStreak: newStreak,
          longestStreak,
          lastReadDate: today,
          streakStartDate,
          lastActivityAt: now,
        },
        $inc: {
          totalPagesRead: pagesRead,
          totalReadingTimeMinutes: minutesRead,
          totalBooksCompleted: bookCompleted ? 1 : 0,
          "readingHistory.$.pagesRead": pagesRead,
          "readingHistory.$.minutesRead": minutesRead,
        },
        $addToSet: {
          "readingHistory.$.booksRead": bookId,
        },
      }
    );
  } else {
    // Add new day's entry
    await UserStats.updateOne(
      { userId },
      {
        $set: {
          currentStreak: newStreak,
          longestStreak,
          lastReadDate: today,
          streakStartDate,
          lastActivityAt: now,
        },
        $inc: {
          totalPagesRead: pagesRead,
          totalReadingTimeMinutes: minutesRead,
          totalBooksCompleted: bookCompleted ? 1 : 0,
        },
        $push: {
          readingHistory: {
            $each: [
              {
                date: today,
                pagesRead,
                minutesRead,
                booksRead: [bookId],
              },
            ],
            $slice: -365, // Keep last 365 days
          },
        },
      }
    );
  }
}
