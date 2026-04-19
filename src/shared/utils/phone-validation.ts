export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 10) return false;

  if (cleaned.startsWith('52')) {
    return cleaned.length >= 12;
  }

  return cleaned.length >= 10;
};

export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('52')) {
    return cleaned;
  }

  if (cleaned.length >= 10) {
    return '52' + cleaned;
  }

  return cleaned;
};
