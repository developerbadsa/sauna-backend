import { z } from 'zod';

export const blogListSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const blogSlugSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

export const blogCreateSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    isPublished: z.boolean().optional(),
  }),
});
