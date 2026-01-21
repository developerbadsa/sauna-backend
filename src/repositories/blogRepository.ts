import { prisma } from '../utils/prisma';

export const blogRepository = {
  list: (skip: number, take: number) =>
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      skip,
      take,
    }),
  findBySlug: (slug: string) => prisma.blogPost.findUnique({ where: { slug } }),
  create: (data: Parameters<typeof prisma.blogPost.create>[0]['data']) =>
    prisma.blogPost.create({ data }),
};
