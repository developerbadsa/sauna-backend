import { Request, Response } from 'express';

import { blogService } from '../services/blogService';
import { AppError } from '../utils/errors';
import { sendSuccess } from '../utils/response';

export const blogController = {
  list: async (req: Request, res: Response) => {
    const { page = '1', limit = '10' } = req.query;
    const data = await blogService.list(Number(page), Number(limit));
    return sendSuccess(res, data);
  },
  getBySlug: async (req: Request, res: Response) => {
    const data = await blogService.getBySlug(req.params.slug);
    if (!data) {
      throw new AppError(404, 'NOT_FOUND', 'Blog post not found');
    }
    return sendSuccess(res, data);
  },
  create: async (req: Request, res: Response) => {
    const data = await blogService.create(req.body);
    return sendSuccess(res, data);
  },
};
