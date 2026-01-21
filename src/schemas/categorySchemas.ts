import { z } from 'zod';

export const categoryCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
  }),
});

export const categoryDeleteSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
