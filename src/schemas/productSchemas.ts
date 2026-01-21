import { z } from 'zod';

export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    q: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    sort: z.enum(['priceAsc', 'priceDesc', 'newest', 'popular']).optional(),
  }),
});

export const productCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    categoryId: z.string().uuid(),
    images: z.array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
      }),
    ),
  }),
});

export const productUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().uuid().optional(),
    images: z
      .array(
        z.object({
          url: z.string().url(),
          alt: z.string().optional(),
        }),
      )
      .optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const productSlugSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});
