import { Router } from 'express';

import { bannerController } from '../controllers/bannerController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { bannerCreateSchema } from '../schemas/bannerSchemas';

export const bannerRoutes = Router();

bannerRoutes.get('/banners', bannerController.list);
bannerRoutes.post('/admin/banners', authenticate, requireAdmin, validate(bannerCreateSchema), bannerController.create);
