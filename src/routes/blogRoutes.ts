import { Router } from 'express';

import { blogController } from '../controllers/blogController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { blogCreateSchema, blogListSchema, blogSlugSchema } from '../schemas/blogSchemas';

export const blogRoutes = Router();

blogRoutes.get('/blog', validate(blogListSchema), blogController.list);
blogRoutes.get('/blog/:slug', validate(blogSlugSchema), blogController.getBySlug);
blogRoutes.post('/admin/blog', authenticate, requireAdmin, validate(blogCreateSchema), blogController.create);
