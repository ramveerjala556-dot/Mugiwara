import type { Request, Response, NextFunction } from 'express';
import { db } from '../storage/db.ts';
import type { User } from '../models/types.ts';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Check header or cookie
  const authHeader = req.headers.authorization;
  const sessionUserId = req.cookies?.mugiwara_user_id || req.headers['x-user-id'];

  let user: User | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    user = db.users.findById(token) || db.users.findByEmail(token);
  } else if (sessionUserId) {
    user = db.users.findById(sessionUserId as string);
  }

  // Fallback to primary Captain user if no session is set
  if (!user) {
    user = db.users.findById('captain-luffy-001') || db.users.find()[0];
  }

  req.user = user;
  next();
}
