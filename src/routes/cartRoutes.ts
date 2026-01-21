import { Router } from 'express';

import { cartController } from '../controllers/cartController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { cartAddSchema, cartDeleteSchema, cartUpdateSchema } from '../schemas/cartSchemas';

export const cartRoutes = Router();

cartRoutes.get('/cart', authenticate, cartController.get);
cartRoutes.post('/cart', authenticate, validate(cartAddSchema), cartController.add);
cartRoutes.patch('/cart/:itemId', authenticate, validate(cartUpdateSchema), cartController.update);
cartRoutes.delete('/cart/:itemId', authenticate, validate(cartDeleteSchema), cartController.remove);
