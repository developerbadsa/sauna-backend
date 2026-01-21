import { z } from 'zod';

export const reviewListSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const reviewCreateSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});

export const reviewAdminUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
    isHidden: z.boolean().optional(),
  }),
});
