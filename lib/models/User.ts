import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the layout component interface
interface ILayoutComponent {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  styles?: Record<string, any>;
}

// Define the layout interface
interface ILayout {
  name: string;
  description?: string;
  components: ILayoutComponent[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the layout schema
const LayoutComponentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  content: { type: String },
  styles: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const LayoutSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a layout name'],
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  components: [LayoutComponentSchema],
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  savedLayouts: ILayout[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
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
      select: false, // Don't return password by default in queries
    },
    savedLayouts: {
      type: [LayoutSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Use mongoose.models to check if the model already exists or create a new one
// This prevents errors when the model is compiled again during hot reloads
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 