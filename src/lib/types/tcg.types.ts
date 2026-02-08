export const TCG_TYPES = {
  POKEMON: 'POKEMON',
  MAGIC: 'MAGIC',
} as const;

export type TCGType = (typeof TCG_TYPES)[keyof typeof TCG_TYPES];
