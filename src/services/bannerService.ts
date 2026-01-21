import { bannerRepository } from '../repositories/bannerRepository';

export const bannerService = {
  list: () => bannerRepository.list(),
  create: (data: { title: string; imageUrl: string; linkUrl?: string }) =>
    bannerRepository.create({
      title: data.title,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl,
    }),
};
