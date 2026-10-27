export const formatCardNumber = (number?: string | null): string => {
  const trimmed = number?.trim().replace(/^#+/, '') ?? '';
  return trimmed ? `#${trimmed}` : '';
};
