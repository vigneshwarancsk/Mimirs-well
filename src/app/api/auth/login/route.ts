import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models';
import { signToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('[API: Login] Connecting to MongoDB...');
    await connectToDatabase();
    console.log('[API: Login] MongoDB connected, querying user...');

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        token,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('[API: Login] ❌ Error occurred:');
    console.error('[API: Login] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[API: Login] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error && error.message.includes('Mongo')) {
      console.error('[API: Login] MongoDB connection error detected!');
      console.error('[API: Login] Check MongoDB URI and network connectivity');
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}
