import { z } from 'zod';

export const cartAddSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
  }),
});

export const cartUpdateSchema = z.object({
  params: z.object({
    itemId: z.string().uuid(),
  }),
  body: z.object({
    quantity: z.number().int().min(1),
  }),
});

export const cartDeleteSchema = z.object({
  params: z.object({
    itemId: z.string().uuid(),
  }),
});
