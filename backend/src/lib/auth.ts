import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'sarthi-local-secret';

export type TokenPayload = {
  userId: string;
  phone: string;
};

export function generateToken(user: User): string {
  const payload: TokenPayload = { userId: user.id, phone: user.phone };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
