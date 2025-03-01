import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Contact from '@/app/models/Contact';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate the data
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Connect to database
    try {
      await connectDB();
      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Create new contact submission
    console.log('Attempting to create contact submission:', { name, email, subject });
    
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    console.log('Successfully created contact submission:', contact);

    return NextResponse.json(
      { message: 'Message sent successfully', contact },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in contact form submission:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error submitting the form' },
      { status: 500 }
    );
  }
} 