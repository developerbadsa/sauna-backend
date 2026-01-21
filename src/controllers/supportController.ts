import { Request, Response } from 'express';

import { AuthRequest } from '../middlewares/auth';
import { supportService } from '../services/supportService';
import { userRepository } from '../repositories/userRepository';
import { AppError } from '../utils/errors';
import { sendSuccess } from '../utils/response';

export const supportController = {
  create: async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId && (!req.body.name || !req.body.email)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Name and email are required for guest support');
    }
    let name = req.body.name;
    let email = req.body.email;
    if (userId && (!name || !email)) {
      const user = await userRepository.findById(userId);
      if (user) {
        name = name ?? user.email.split('@')[0];
        email = email ?? user.email;
      }
    }
    if (!name || !email) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Name and email are required');
    }
    const data = await supportService.create({
      userId,
      name,
      email,
      subject: req.body.subject,
      message: req.body.message,
    });
    return sendSuccess(res, data);
  },
  list: async (req: Request, res: Response) => {
    const { status, page = '1', limit = '10' } = req.query;
    const data = await supportService.list(status as string | undefined, Number(page), Number(limit));
    return sendSuccess(res, data.items, data.meta);
  },
};
