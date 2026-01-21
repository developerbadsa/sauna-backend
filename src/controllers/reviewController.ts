import { Request, Response } from 'express';

import { AuthRequest } from '../middlewares/auth';
import { reviewService } from '../services/reviewService';
import { sendSuccess } from '../utils/response';

export const reviewController = {
  list: async (req: Request, res: Response) => {
    const { page = '1', limit = '10' } = req.query;
    const data = await reviewService.list(req.params.id, Number(page), Number(limit));
    return sendSuccess(res, data.items, data.meta);
  },
  create: async (req: AuthRequest, res: Response) => {
    const data = await reviewService.create(req.user!.id, req.params.id, req.body.rating, req.body.comment);
    return sendSuccess(res, data);
  },
  update: async (req: Request, res: Response) => {
    const data = await reviewService.update(req.params.id, req.body);
    return sendSuccess(res, data);
  },
};
