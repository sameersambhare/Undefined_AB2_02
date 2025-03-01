import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const { name, email, password } = await req.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide name, email, and password' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });
    
    // Generate JWT token
    const token = generateToken(user._id.toString());
    
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
    console.error('Signup error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 