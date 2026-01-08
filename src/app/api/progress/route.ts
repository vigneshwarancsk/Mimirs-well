import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ReadingProgress, LibraryItem } from '@/lib/db/models';
import { verifyToken } from '@/lib/auth/jwt';

// Get reading progress for a book
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

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

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
    console.error('Get progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get progress' },
      { status: 500 }
    );
  }
}

// Update reading progress
export async function POST(request: NextRequest) {
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

    const { bookId, currentPage, totalPages } = await request.json();
    if (!bookId || !currentPage || !totalPages) {
      return NextResponse.json(
        { success: false, error: 'Book ID, current page, and total pages are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const completed = currentPage >= totalPages;

    const progress = await ReadingProgress.findOneAndUpdate(
      { userId: payload.userId, bookId },
      {
        userId: payload.userId,
        bookId,
        currentPage,
        totalPages,
        lastReadAt: new Date(),
        completed,
      },
      { upsert: true, new: true }
    );

    // Update library item status
    await LibraryItem.findOneAndUpdate(
      { userId: payload.userId, bookId },
      { 
        status: completed ? 'completed' : 'reading',
        userId: payload.userId,
        bookId,
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
