import { prisma } from '../utils/prisma';

export const categoryRepository = {
  list: () => prisma.category.findMany({ orderBy: { name: 'asc' } }),
  create: (data: Parameters<typeof prisma.category.create>[0]['data']) =>
    prisma.category.create({ data }),
  findById: (id: string) => prisma.category.findUnique({ where: { id } }),
  findBySlug: (slug: string) => prisma.category.findUnique({ where: { slug } }),
  delete: (id: string) => prisma.category.delete({ where: { id } }),
  countProducts: (id: string) => prisma.product.count({ where: { categoryId: id, deletedAt: null } }),
};
