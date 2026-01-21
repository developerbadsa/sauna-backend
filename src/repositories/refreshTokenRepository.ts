import { prisma } from '../utils/prisma';

export const refreshTokenRepository = {
  create: (data: Parameters<typeof prisma.refreshToken.create>[0]['data']) =>
    prisma.refreshToken.create({ data }),
  deleteById: (id: string) => prisma.refreshToken.delete({ where: { id } }),
  findByTokenHash: (tokenHash: string) =>
    prisma.refreshToken.findFirst({ where: { tokenHash } }),
};
