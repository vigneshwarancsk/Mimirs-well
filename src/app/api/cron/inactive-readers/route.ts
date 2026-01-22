import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, ReadingProgress, ReminderLog } from "@/lib/db/models";
import { getContentProvider } from "@/lib/content";

// Contentstack Automation URL for inactive reader reminders
const AUTOMATION_URL =
  "https://app.contentstack.com/automations-api/run/55e20fe67e194521bf0e77938753d698";

// Cron secret for security - set this in your environment variables
const CRON_SECRET = process.env.CRON_SECRET;

// Reminder intervals in days
const REMINDER_INTERVALS = [7, 14, 21, 28];

// Helper to get reminder type based on days inactive
function getReminderType(daysInactive: number): string | null {
  if (daysInactive >= 28) return "inactive_28_days";
  if (daysInactive >= 21) return "inactive_21_days";
  if (daysInactive >= 14) return "inactive_14_days";
  if (daysInactive >= 7) return "inactive_7_days";
  return null;
}

// Format date for email
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const providedSecret = authHeader?.replace("Bearer ", "");

    if (CRON_SECRET && providedSecret !== CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log('[API: Cron] Starting inactive readers check...');
    console.log('[API: Cron] Connecting to MongoDB...');
    await connectToDatabase();
    console.log('[API: Cron] MongoDB connected successfully!');

    const now = new Date();
    const results = {
      processed: 0,
      remindersSent: 0,
      errors: [] as string[],
      details: [] as {
        userName: string;
        bookName: string;
        daysInactive: number;
        reminderType: string;
      }[],
    };

    // Find all reading progress entries that are:
    // 1. Not completed
    // 2. Have a lastReadAt date
    const incompleteBooks = await ReadingProgress.find({
      completed: false,
      lastReadAt: { $exists: true },
    }).populate("userId");

    // Get book details from content provider
    const provider = getContentProvider();
    const allBooks = await provider.getAllBooks();
    const bookMap = new Map(allBooks.map((b) => [b.id, b]));

    for (const progress of incompleteBooks) {
      results.processed++;

      // Calculate days since last read
      const lastRead = new Date(progress.lastReadAt);
      const diffTime = Math.abs(now.getTime() - lastRead.getTime());
      const daysInactive = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Check if this qualifies for a reminder
      const reminderType = getReminderType(daysInactive);
      if (!reminderType) continue;

      // Get user details
      const user = progress.userId as unknown as {
        _id: string;
        email: string;
        name: string;
      };

      if (!user || !user.email) continue;

      // Check if we already sent this type of reminder for this book
      const existingReminder = await ReminderLog.findOne({
        userId: user._id,
        bookId: progress.bookId,
        reminderType: reminderType,
      });

      if (existingReminder) {
        // Already sent this reminder level, skip
        continue;
      }

      // Get book details
      const book = bookMap.get(progress.bookId);
      if (!book) continue;

      // Prepare automation payload
      const payload = {
        name: user.name,
        email: user.email,
        book_name: book.title,
        start_date: formatDate(progress.firstReadAt || lastRead),
        days_inactive: daysInactive,
        resume_link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/read/${progress.bookId}`,
      };

      console.log(`Sending reminder to ${user.email} for "${book.title}" (${daysInactive} days inactive)`);

      // Send to Contentstack Automation
      try {
        const response = await fetch(AUTOMATION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const success = response.ok;

        // Log the reminder
        await ReminderLog.create({
          userId: user._id,
          userEmail: user.email,
          userName: user.name,
          bookId: progress.bookId,
          bookName: book.title,
          reminderType: reminderType,
          daysInactive: daysInactive,
          sentAt: now,
          automationResponse: {
            success,
            message: success ? "Email sent successfully" : `HTTP ${response.status}`,
          },
        });

        if (success) {
          results.remindersSent++;
          results.details.push({
            userName: user.name,
            bookName: book.title,
            daysInactive,
            reminderType,
          });
        } else {
          results.errors.push(`Failed to send reminder to ${user.email}: HTTP ${response.status}`);
        }

        // Update daysInactive in progress
        await ReadingProgress.updateOne(
          { _id: progress._id },
          { $set: { daysInactive } }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.errors.push(`Error sending to ${user.email}: ${errorMessage}`);
      }
    }

    console.log(`Cron job completed: ${results.remindersSent} reminders sent out of ${results.processed} processed`);

    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} entries, sent ${results.remindersSent} reminders`,
      results,
    });
  } catch (error) {
    console.error("[API: Cron] ❌ Error occurred:");
    console.error("[API: Cron] Error message:", error instanceof Error ? error.message : String(error));
    console.error("[API: Cron] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error && error.message.includes("Mongo")) {
      console.error("[API: Cron] MongoDB connection error detected!");
      console.error("[API: Cron] Check MongoDB URI and network connectivity");
    }
    
    return NextResponse.json(
      { error: "Failed to process inactive readers" },
      { status: 500 }
    );
  }
}

// Also support POST for Vercel Cron
export async function POST(request: NextRequest) {
  return GET(request);
}
