export const DEFAULT_PAGE_SIZE = 10;

export const CUSTOMER_LIST_SORT_COLUMNS = [
  'name',
  'createdDate',
  'customerName',
] as const;

export const TCG_BADGE_LABELS: Record<string, string> = {
  POKEMON: 'Pokémon',
  MAGIC: 'Magic',
};

export const EXPORT_MESSAGES = {
  SUCCESS: 'Descarga iniciada',
  ERROR: 'Error al generar el archivo de exportación',
};
