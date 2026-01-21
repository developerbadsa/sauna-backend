import { Request, Response } from 'express';

import { categoryService } from '../services/categoryService';
import { sendSuccess } from '../utils/response';

export const categoryController = {
  list: async (_req: Request, res: Response) => {
    const data = await categoryService.list();
    return sendSuccess(res, data);
  },
  create: async (req: Request, res: Response) => {
    const data = await categoryService.create(req.body.name);
    return sendSuccess(res, data);
  },
  remove: async (req: Request, res: Response) => {
    const data = await categoryService.remove(req.params.id);
    return sendSuccess(res, data);
  },
};
