import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export function generateResetToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
} 