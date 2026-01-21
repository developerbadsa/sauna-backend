import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

import { AppError } from '../utils/errors';

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid request data', result.error.flatten());
  }

  req.body = result.data.body;
  req.query = result.data.query;
  req.params = result.data.params;

  return next();
};
