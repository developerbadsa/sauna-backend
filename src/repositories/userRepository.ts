import { prisma } from '../utils/prisma';

export const userRepository = {
  create: (data: Parameters<typeof prisma.user.create>[0]['data']) =>
    prisma.user.create({ data }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  update: (id: string, data: Parameters<typeof prisma.user.update>[0]['data']) =>
    prisma.user.update({ where: { id }, data }),
};
