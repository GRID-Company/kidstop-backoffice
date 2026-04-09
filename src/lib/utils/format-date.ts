export const formatDate = (
  date: string | null | undefined,
  fallback = ''
): string => {
  if (!date) return fallback;
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (
  date: string | null | undefined,
  fallback = ''
): string => {
  if (!date) return fallback;
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatUnixDateTime = (
  dateStr: string | null | undefined,
  fallback = '—'
): string => {
  if (!dateStr) return fallback;
  return new Date(Number(dateStr)).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
