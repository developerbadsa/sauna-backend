import { z } from 'zod';

export const supportCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    subject: z.string().min(3),
    message: z.string().min(5),
  }),
});

export const supportAdminListSchema = z.object({
  query: z.object({
    status: z.enum(['OPEN', 'RESOLVED']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
