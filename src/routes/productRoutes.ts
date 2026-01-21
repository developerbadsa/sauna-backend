import { Router } from 'express';

import { productController } from '../controllers/productController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  listProductsSchema,
  productCreateSchema,
  productSlugSchema,
  productUpdateSchema,
} from '../schemas/productSchemas';

export const productRoutes = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products
 */
productRoutes.get('/products', validate(listProductsSchema), productController.list);

/**
 * @openapi
 * /products/{slug}:
 *   get:
 *     summary: Get product by slug
 */
productRoutes.get('/products/:slug', validate(productSlugSchema), productController.getBySlug);

productRoutes.post(
  '/admin/products',
  authenticate,
  requireAdmin,
  validate(productCreateSchema),
  productController.create,
);

productRoutes.patch(
  '/admin/products/:id',
  authenticate,
  requireAdmin,
  validate(productUpdateSchema),
  productController.update,
);

productRoutes.delete(
  '/admin/products/:id',
  authenticate,
  requireAdmin,
  validate(productUpdateSchema.pick({ params: true })),
  productController.remove,
);
