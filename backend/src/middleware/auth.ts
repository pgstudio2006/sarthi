import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../lib/auth';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // AUTH BYPASS: create a mock user for now
    req.user = { userId: 'dev-user', phone: '9999999999' };
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    // AUTH BYPASS: even with invalid token, let it through
    req.user = { userId: 'dev-user', phone: '9999999999' };
    next();
  }
}
