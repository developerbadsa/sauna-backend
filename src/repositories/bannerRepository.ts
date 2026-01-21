import { prisma } from '../utils/prisma';

export const bannerRepository = {
  list: () => prisma.banner.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
  create: (data: Parameters<typeof prisma.banner.create>[0]['data']) =>
    prisma.banner.create({ data }),
};
