import { prisma } from '../utils/prisma';

export const wishlistRepository = {
  list: (userId: string) =>
    prisma.wishlistItem.findMany({ where: { userId }, include: { product: true } }),
  add: (userId: string, productId: string) =>
    prisma.wishlistItem.create({ data: { userId, productId } }),
  remove: (id: string, userId: string) =>
    prisma.wishlistItem.deleteMany({ where: { id, userId } }),
  findByUserProduct: (userId: string, productId: string) =>
    prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } }),
};
