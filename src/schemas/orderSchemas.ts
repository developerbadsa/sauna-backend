import { z } from 'zod';

export const orderCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    address1: z.string().min(5),
    address2: z.string().optional(),
    city: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().min(2),
  }),
});

export const orderListSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    all: z.string().optional(),
  }),
});

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const orderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  }),
});
