import { Response } from 'express';

import { AuthRequest } from '../middlewares/auth';
import { wishlistService } from '../services/wishlistService';
import { sendSuccess } from '../utils/response';

export const wishlistController = {
  list: async (req: AuthRequest, res: Response) => {
    const data = await wishlistService.list(req.user!.id);
    return sendSuccess(res, data);
  },
  add: async (req: AuthRequest, res: Response) => {
    const data = await wishlistService.add(req.user!.id, req.body.productId);
    return sendSuccess(res, data);
  },
  remove: async (req: AuthRequest, res: Response) => {
    const data = await wishlistService.remove(req.user!.id, req.params.id);
    return sendSuccess(res, data);
  },
};
