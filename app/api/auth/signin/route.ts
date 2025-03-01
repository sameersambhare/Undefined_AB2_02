import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    console.log('Attempting to connect to database for signin...');
    await connectToDatabase();
    console.log('Database connection successful for signin');
    
    // Parse the request body
    const { email, password } = await req.json();
    console.log('Signin attempt for email:', email);
    
    // Validate input
    if (!email || !password) {
      console.log('Missing email or password in signin request');
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }
    
    // Find user by email and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('User found, verifying password');
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('Password verified, generating token');
    
    // Generate JWT token
    const token = generateToken(user._id.toString());
    
    console.log('Signin successful for user:', email);
    
    // Return success response with token and user data (excluding password)
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    
    // Provide more specific error messages based on the error type
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('MongoDB error during signin:', error.message);
      return NextResponse.json(
        { error: 'Database error. Please try again later.' },
        { status: 500 }
      );
    }
    
    if (error.name === 'ValidationError') {
      console.error('Validation error during signin:', error.message);
      return NextResponse.json(
        { error: 'Invalid input data.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 