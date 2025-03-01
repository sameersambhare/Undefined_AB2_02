import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/auth/me - Checking user authentication');
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    console.log('Authorization header exists:', !!authHeader);
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    console.log('Token extracted from header:', token.substring(0, 20) + '...');
    
    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      console.log('Token verification failed');
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    console.log('Token verified for user ID:', payload.userId);
    
    // Connect to the database
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connection successful');
    
    // Find the user
    console.log('Finding user with ID:', payload.userId);
    const user = await User.findById(payload.userId);
    
    if (!user) {
      console.log('User not found with ID:', payload.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('User found:', user.email);
    
    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 