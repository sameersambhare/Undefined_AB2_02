// This script creates a test user in the database
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

console.log('MongoDB URI:', MONGODB_URI.substring(0, MONGODB_URI.indexOf('@')));

// Define the User schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    savedLayouts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model('User', UserSchema);

async function createTestUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      console.log('User ID:', existingUser._id);
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      // Create the test user
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      });
      
      await testUser.save();
      console.log('Test user created successfully');
      console.log('Email: test@example.com');
      console.log('Password: password123');
      console.log('User ID:', testUser._id);
    }
    
    // List all users
    const users = await User.find({}, 'name email createdAt');
    console.log('\nAll users in the database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Created: ${user.createdAt}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUser(); 