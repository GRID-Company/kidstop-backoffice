export const formatDaysInInventory = (days: number): string => {
  if (days === 0) return 'Sin stock';
  if (days === 1) return '1 día';
  return `${days} días`;
};
