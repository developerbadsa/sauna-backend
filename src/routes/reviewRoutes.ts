import { Router } from 'express';

import { reviewController } from '../controllers/reviewController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { reviewAdminUpdateSchema, reviewCreateSchema, reviewListSchema } from '../schemas/reviewSchemas';

export const reviewRoutes = Router();

reviewRoutes.get('/products/:id/reviews', validate(reviewListSchema), reviewController.list);
reviewRoutes.post(
  '/products/:id/reviews',
  authenticate,
  validate(reviewCreateSchema),
  reviewController.create,
);
reviewRoutes.patch(
  '/admin/reviews/:id',
  authenticate,
  requireAdmin,
  validate(reviewAdminUpdateSchema),
  reviewController.update,
);
