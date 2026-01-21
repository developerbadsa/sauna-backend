import { Request, Response } from 'express';

import { authService } from '../services/authService';
import { sendSuccess } from '../utils/response';

export const authController = {
  register: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await authService.register(email, password);
    return sendSuccess(res, data);
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return sendSuccess(res, data);
  },
  verifyEmail: async (req: Request, res: Response) => {
    const { email, token } = req.body;
    const data = await authService.verifyEmail(email, token);
    return sendSuccess(res, data);
  },
  forgotPassword: async (req: Request, res: Response) => {
    const { email } = req.body;
    const data = await authService.forgotPassword(email);
    return sendSuccess(res, data);
  },
  resetPassword: async (req: Request, res: Response) => {
    const { email, token, password } = req.body;
    const data = await authService.resetPassword(email, token, password);
    return sendSuccess(res, data);
  },
};
