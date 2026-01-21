import { prisma } from '../utils/prisma';

export const supportRepository = {
  create: (data: Parameters<typeof prisma.supportMessage.create>[0]['data']) =>
    prisma.supportMessage.create({ data }),
  list: (status: string | undefined, skip: number, take: number) =>
    prisma.supportMessage.findMany({
      where: status ? { status: status as 'OPEN' | 'RESOLVED' } : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { user: { select: { id: true, email: true } } },
    }),
  count: (status?: string) =>
    prisma.supportMessage.count({
      where: status ? { status: status as 'OPEN' | 'RESOLVED' } : undefined,
    }),
};
