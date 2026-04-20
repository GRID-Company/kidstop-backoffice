import { IBannerConfig } from '../../domain/types';

export const toBannerMutationInput = (bannerGuids: IBannerConfig) => {
  return {
    bannerGuids: {
      pokemon: bannerGuids.pokemon || null,
      magic: bannerGuids.magic || null,
    },
  };
};

export const fromApiBanners = (apiData: any): IBannerConfig => {
  if (!apiData) {
    return {};
  }

  return {
    pokemon: apiData.pokemon || undefined,
    magic: apiData.magic || undefined,
  };
};
