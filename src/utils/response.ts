import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, meta?: Record<string, unknown>) => {
  return res.json({ success: true, data, meta });
};

export const sendError = (
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) => {
  return res.status(status).json({
    success: false,
    error: { code, message, details },
  });
};
