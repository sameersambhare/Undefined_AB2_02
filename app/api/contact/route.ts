import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Contact from '@/app/models/Contact';
import { thankYouEmailTemplate } from '@/app/lib/emailTemplates';
import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP with regular password
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

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

    // Send thank you email
    const { subject: emailSubject, body: emailBody } = thankYouEmailTemplate(name);
    
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
      console.log('Thank you email sent successfully');
    } catch (error) {
      console.error('Error sending thank you email:', error);
      // Don't return error response here as the contact was still saved
    }

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