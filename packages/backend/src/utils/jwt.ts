import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): { token: string; expiresAt: Date } {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { token, expiresAt };
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
