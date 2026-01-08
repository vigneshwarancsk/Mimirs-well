import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { LibraryItem } from '@/lib/db/models';
import { verifyToken } from '@/lib/auth/jwt';

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

    const { bookId, liked } = await request.json();
    if (!bookId || liked === undefined) {
      return NextResponse.json(
        { success: false, error: 'Book ID and liked status are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const libraryItem = await LibraryItem.findOneAndUpdate(
      { userId: payload.userId, bookId },
      { liked },
      { new: true }
    );

    if (!libraryItem) {
      // If not in library, add it with liked status
      const newItem = await LibraryItem.create({
        userId: payload.userId,
        bookId,
        liked,
        status: 'saved',
      });
      return NextResponse.json({ success: true, data: newItem });
    }

    return NextResponse.json({ success: true, data: libraryItem });
  } catch (error) {
    console.error('Like book error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update like status' },
      { status: 500 }
    );
  }
}
