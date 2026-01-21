import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import { AppError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: { id: string; role: 'USER' | 'ADMIN' };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Missing access token');
  }
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret) as {
      sub: string;
      role: 'USER' | 'ADMIN';
    };
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid access token');
  }
};

export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next();
  }
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret) as {
      sub: string;
      role: 'USER' | 'ADMIN';
    };
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    return next();
  }
};

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new AppError(403, 'FORBIDDEN', 'Admin access required');
  }
  return next();
};
