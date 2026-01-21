import { z } from 'zod';

export const wishlistAddSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
  }),
});

export const wishlistDeleteSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
