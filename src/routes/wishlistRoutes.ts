import { Router } from 'express';

import { wishlistController } from '../controllers/wishlistController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { wishlistAddSchema, wishlistDeleteSchema } from '../schemas/wishlistSchemas';

export const wishlistRoutes = Router();

wishlistRoutes.get('/wishlist', authenticate, wishlistController.list);
wishlistRoutes.post('/wishlist', authenticate, validate(wishlistAddSchema), wishlistController.add);
wishlistRoutes.delete('/wishlist/:id', authenticate, validate(wishlistDeleteSchema), wishlistController.remove);
