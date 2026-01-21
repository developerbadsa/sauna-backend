import { Router } from 'express';

import { supportController } from '../controllers/supportController';
import { optionalAuth, authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { supportAdminListSchema, supportCreateSchema } from '../schemas/supportSchemas';

export const supportRoutes = Router();

supportRoutes.post('/support/messages', optionalAuth, validate(supportCreateSchema), supportController.create);

supportRoutes.get(
  '/admin/support/messages',
  authenticate,
  requireAdmin,
  validate(supportAdminListSchema),
  supportController.list,
);
