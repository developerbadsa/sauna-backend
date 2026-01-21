import { Response } from 'express';

import { AuthRequest } from '../middlewares/auth';
import { cartService } from '../services/cartService';
import { sendSuccess } from '../utils/response';

export const cartController = {
  get: async (req: AuthRequest, res: Response) => {
    const data = await cartService.get(req.user!.id);
    return sendSuccess(res, data);
  },
  add: async (req: AuthRequest, res: Response) => {
    const data = await cartService.addItem(req.user!.id, req.body.productId, req.body.quantity);
    return sendSuccess(res, data);
  },
  update: async (req: AuthRequest, res: Response) => {
    const data = await cartService.updateItem(req.user!.id, req.params.itemId, req.body.quantity);
    return sendSuccess(res, data);
  },
  remove: async (req: AuthRequest, res: Response) => {
    const data = await cartService.removeItem(req.user!.id, req.params.itemId);
    return sendSuccess(res, data);
  },
};
