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
  console.log('[AUTH]', req.method, req.path, 'header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    console.log('[AUTH] verify failed:', (err as Error).message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
