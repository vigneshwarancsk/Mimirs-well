import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ReadingProgress } from '@/lib/db/models';
import { UserStats } from '@/lib/db/models/UserStats';
import { verifyToken } from '@/lib/auth/jwt';

// Get user reading stats
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get or create user stats
    let userStats = await UserStats.findOne({ userId: payload.userId });
    
    if (!userStats) {
      // Create default stats
      userStats = await UserStats.create({
        userId: payload.userId,
        currentStreak: 0,
        longestStreak: 0,
        totalBooksCompleted: 0,
        totalPagesRead: 0,
        totalReadingTimeMinutes: 0,
        readingHistory: [],
      });
    }

    // Get counts from reading progress
    const booksInProgress = await ReadingProgress.countDocuments({
      userId: payload.userId,
      completed: false,
    });

    const booksCompleted = await ReadingProgress.countDocuments({
      userId: payload.userId,
      completed: true,
    });

    // Get weekly reading activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyHistory = userStats.readingHistory
      .filter((h: { date: Date }) => new Date(h.date) >= oneWeekAgo)
      .map((h: { date: Date; pagesRead: number; minutesRead: number; booksRead: string[] }) => ({
        date: h.date,
        pagesRead: h.pagesRead,
        minutesRead: h.minutesRead,
      }));

    // Calculate this week's stats
    const thisWeekPages = weeklyHistory.reduce((sum: number, h: { pagesRead: number }) => sum + h.pagesRead, 0);
    const thisWeekMinutes = weeklyHistory.reduce((sum: number, h: { minutesRead: number }) => sum + h.minutesRead, 0);
    const daysActiveThisWeek = weeklyHistory.length;

    return NextResponse.json({
      success: true,
      data: {
        // Streak info
        currentStreak: userStats.currentStreak,
        longestStreak: userStats.longestStreak,
        streakStartDate: userStats.streakStartDate,
        lastReadDate: userStats.lastReadDate,
        
        // Overall stats
        totalBooksCompleted: booksCompleted,
        totalPagesRead: userStats.totalPagesRead,
        totalReadingTimeMinutes: userStats.totalReadingTimeMinutes,
        booksInProgress,
        
        // This week
        thisWeekPages,
        thisWeekMinutes,
        daysActiveThisWeek,
        weeklyHistory,
        
        // For reminders
        lastActivityAt: userStats.lastActivityAt,
        reminderEnabled: userStats.reminderEnabled,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
