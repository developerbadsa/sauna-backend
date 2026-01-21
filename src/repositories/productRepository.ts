import { Prisma } from '@prisma/client';

import { prisma } from '../utils/prisma';

export const productRepository = {
  list: (filters: Prisma.ProductWhereInput, orderBy: Prisma.ProductOrderByWithRelationInput, skip: number, take: number) =>
    prisma.product.findMany({
      where: filters,
      orderBy,
      skip,
      take,
      include: { images: true, category: true },
    }),
  count: (filters: Prisma.ProductWhereInput) => prisma.product.count({ where: filters }),
  findBySlug: (slug: string) =>
    prisma.product.findFirst({
      where: { slug, deletedAt: null },
      include: { images: true, category: true, reviews: true },
    }),
  findById: (id: string) =>
    prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { images: true, category: true },
    }),
  create: (data: Prisma.ProductCreateInput) => prisma.product.create({ data, include: { images: true, category: true } }),
  update: (id: string, data: Prisma.ProductUpdateInput) =>
    prisma.product.update({ where: { id }, data, include: { images: true, category: true } }),
  softDelete: (id: string) => prisma.product.update({ where: { id }, data: { deletedAt: new Date() } }),
};
