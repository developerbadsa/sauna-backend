import { prisma } from '../utils/prisma';

export const reviewRepository = {
  listByProduct: (productId: string, skip: number, take: number) =>
    prisma.review.findMany({
      where: { productId, isHidden: false },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { user: { select: { id: true, email: true } } },
    }),
  countByProduct: (productId: string) =>
    prisma.review.count({ where: { productId, isHidden: false } }),
  create: (data: Parameters<typeof prisma.review.create>[0]['data']) =>
    prisma.review.create({ data }),
  update: (id: string, data: Parameters<typeof prisma.review.update>[0]['data']) =>
    prisma.review.update({ where: { id }, data }),
  findByUserProduct: (userId: string, productId: string) =>
    prisma.review.findUnique({ where: { userId_productId: { userId, productId } } }),
};
