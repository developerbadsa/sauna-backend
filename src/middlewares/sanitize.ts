import { NextFunction, Request, Response } from 'express';

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return value.replace(/<script.*?>.*?<\/script>/gi, '').trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, sanitizeValue(val)]),
    );
  }
  return value;
};

export const sanitize = (req: Request, _res: Response, next: NextFunction) => {
  req.body = sanitizeValue(req.body) as typeof req.body;
  req.query = sanitizeValue(req.query) as typeof req.query;
  req.params = sanitizeValue(req.params) as typeof req.params;
  next();
};
