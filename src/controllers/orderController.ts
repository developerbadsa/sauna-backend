import { Response } from 'express';

import { AuthRequest } from '../middlewares/auth';
import { orderService } from '../services/orderService';
import { sendSuccess } from '../utils/response';

export const orderController = {
  create: async (req: AuthRequest, res: Response) => {
    const data = await orderService.createFromCart(req.user!.id, {
      name: req.body.name,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
    });
    return sendSuccess(res, data);
  },
  list: async (req: AuthRequest, res: Response) => {
    const { page = '1', limit = '10', all } = req.query;
    const isAdmin = req.user?.role === 'ADMIN' && all === 'true';
    const data = await orderService.list(req.user!.id, isAdmin, Number(page), Number(limit));
    return sendSuccess(res, data.items, data.meta);
  },
  getById: async (req: AuthRequest, res: Response) => {
    const isAdmin = req.user?.role === 'ADMIN';
    const data = await orderService.getById(req.user!.id, isAdmin, req.params.id);
    return sendSuccess(res, data);
  },
  updateStatus: async (req: AuthRequest, res: Response) => {
    const data = await orderService.updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, data);
  },
};
