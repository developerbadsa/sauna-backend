import { Request, Response } from 'express';

import { productService } from '../services/productService';
import { sendSuccess } from '../utils/response';

export const productController = {
  list: async (req: Request, res: Response) => {
    const { page = '1', limit = '10', q, category, minPrice, maxPrice, sort } = req.query;
    const data = await productService.list({
      page: Number(page),
      limit: Number(limit),
      q: q as string | undefined,
      category: category as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort as string | undefined,
    });
    return sendSuccess(res, data.items, data.meta);
  },
  getBySlug: async (req: Request, res: Response) => {
    const data = await productService.getBySlug(req.params.slug);
    return sendSuccess(res, data);
  },
  create: async (req: Request, res: Response) => {
    const data = await productService.create(req.body);
    return sendSuccess(res, data);
  },
  update: async (req: Request, res: Response) => {
    const data = await productService.update(req.params.id, req.body);
    return sendSuccess(res, data);
  },
  remove: async (req: Request, res: Response) => {
    const data = await productService.remove(req.params.id);
    return sendSuccess(res, data);
  },
};
