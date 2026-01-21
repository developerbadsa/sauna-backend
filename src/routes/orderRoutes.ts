import { Router } from 'express';

import { orderController } from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { orderCreateSchema, orderIdSchema, orderListSchema, orderStatusSchema } from '../schemas/orderSchemas';

export const orderRoutes = Router();

orderRoutes.post('/orders', authenticate, validate(orderCreateSchema), orderController.create);
orderRoutes.get('/orders', authenticate, validate(orderListSchema), orderController.list);
orderRoutes.get('/orders/:id', authenticate, validate(orderIdSchema), orderController.getById);
orderRoutes.patch(
  '/orders/:id/status',
  authenticate,
  requireAdmin,
  validate(orderStatusSchema),
  orderController.updateStatus,
);
