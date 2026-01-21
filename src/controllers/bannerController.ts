import { Request, Response } from 'express';

import { bannerService } from '../services/bannerService';
import { sendSuccess } from '../utils/response';

export const bannerController = {
  list: async (_req: Request, res: Response) => {
    const data = await bannerService.list();
    return sendSuccess(res, data);
  },
  create: async (req: Request, res: Response) => {
    const data = await bannerService.create(req.body);
    return sendSuccess(res, data);
  },
};
