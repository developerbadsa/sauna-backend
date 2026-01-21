import { Prisma } from '@prisma/client';

import { prisma } from '../utils/prisma';

export const orderRepository = {
  create: (data: Prisma.OrderCreateInput) =>
    prisma.order.create({
      data,
      include: { items: true },
    }),
  listByUser: (userId: string, skip: number, take: number) =>
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { items: true },
    }),
  listAll: (skip: number, take: number) =>
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { items: true, user: { select: { email: true, id: true } } },
    }),
  findById: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      include: { items: true, user: { select: { id: true, email: true } } },
    }),
  updateStatus: (id: string, status: Prisma.OrderUpdateInput['status']) =>
    prisma.order.update({ where: { id }, data: { status } }),
  countByUser: (userId: string) => prisma.order.count({ where: { userId } }),
  countAll: () => prisma.order.count(),
};
