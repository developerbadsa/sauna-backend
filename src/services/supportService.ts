import { supportRepository } from '../repositories/supportRepository';

export const supportService = {
  create: (data: { userId?: string; name: string; email: string; subject: string; message: string }) =>
    supportRepository.create(data),
  list: async (status: string | undefined, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      supportRepository.list(status, skip, limit),
      supportRepository.count(status),
    ]);
    return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  },
};
