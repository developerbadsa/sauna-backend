import { z } from 'zod';

export const bannerCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    imageUrl: z.string().url(),
    linkUrl: z.string().url().optional(),
  }),
});
