import { Router } from 'express';

import { categoryController } from '../controllers/categoryController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { categoryCreateSchema, categoryDeleteSchema } from '../schemas/categorySchemas';

export const categoryRoutes = Router();

categoryRoutes.get('/categories', categoryController.list);
categoryRoutes.post(
  '/admin/categories',
  authenticate,
  requireAdmin,
  validate(categoryCreateSchema),
  categoryController.create,
);
categoryRoutes.delete(
  '/admin/categories/:id',
  authenticate,
  requireAdmin,
  validate(categoryDeleteSchema),
  categoryController.remove,
);
