import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';
import { welcomeEmailTemplate } from '@/app/lib/emailTemplates';
import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

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

    // Send welcome email
    const { subject: emailSubject, body: emailBody } = welcomeEmailTemplate(name);
    
    try {
      await transporter.sendMail({
        from: {
          name: 'UI Designer Team',
          address: process.env.EMAIL_USER as string
        },
        to: email,
        subject: emailSubject,
        html: emailBody,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8'
        }
      });
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't return error response here as the user was still created
    }
    
    // Return success response with token and user data
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
} 