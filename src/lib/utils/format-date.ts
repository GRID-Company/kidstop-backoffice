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

function parseFlexibleDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (/^\d+$/.test(dateStr)) {
    const timestamp = Number(dateStr);
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

export const formatFlexibleDate = (
  dateStr: string | null | undefined,
  fallback = ''
): string => {
  if (!dateStr) return fallback;
  const date = parseFlexibleDate(dateStr);
  if (!date) return fallback;
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatReleaseDate = (
  dateStr: string | null | undefined,
  fallback = ''
): string => {
  if (!dateStr) return fallback;
  const date = parseFlexibleDate(dateStr);
  if (!date) return fallback;
  return date.toLocaleDateString('es-MX', {
    month: 'short',
    year: 'numeric',
  });
};
