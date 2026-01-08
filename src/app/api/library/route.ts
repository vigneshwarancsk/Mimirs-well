import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { LibraryItem, ReadingProgress } from '@/lib/db/models';
import { verifyToken } from '@/lib/auth/jwt';

// Get user's library
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

    const libraryItems = await LibraryItem.find({ userId: payload.userId });
    const progress = await ReadingProgress.find({ userId: payload.userId });

    // Create a map of bookId to progress
    const progressMap = new Map(
      progress.map(p => [p.bookId, {
        currentPage: p.currentPage,
        totalPages: p.totalPages,
        lastReadAt: p.lastReadAt,
        completed: p.completed,
      }])
    );

    // Combine library items with progress
    const library = libraryItems.map(item => ({
      bookId: item.bookId,
      status: item.status,
      liked: item.liked,
      addedAt: item.addedAt,
      progress: progressMap.get(item.bookId) || null,
    }));

    return NextResponse.json({ success: true, data: library });
  } catch (error) {
    console.error('Get library error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get library' },
      { status: 500 }
    );
  }
}

// Add book to library
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

    const { bookId, status = 'saved' } = await request.json();
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const libraryItem = await LibraryItem.findOneAndUpdate(
      { userId: payload.userId, bookId },
      { userId: payload.userId, bookId, status },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: libraryItem });
  } catch (error) {
    console.error('Add to library error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to library' },
      { status: 500 }
    );
  }
}

// Remove book from library
export async function DELETE(request: NextRequest) {
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

    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    await LibraryItem.findOneAndDelete({ userId: payload.userId, bookId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove from library error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from library' },
      { status: 500 }
    );
  }
}
