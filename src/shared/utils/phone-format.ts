/**
 * Formatea un número de teléfono mexicano para visualización
 * Soporta entrada en múltiples formatos y retorna formato legible: +52 XX XXXX XXXX
 * @param phone - Teléfono en cualquier formato (con o sin símbolos, con o sin prefijo)
 * @returns Teléfono formateado para visualización
 * @example
 * formatPhoneNumber('5512345678') => '+52 55 1234 5678'
 * formatPhoneNumber('+525512345678') => '+52 55 1234 5678'
 * formatPhoneNumber('55 1234 5678') => '+52 55 1234 5678'
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 0) return '';

  if (cleaned.length <= 2) {
    return cleaned;
  }

  if (cleaned.length <= 5) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
  }

  if (cleaned.length <= 9) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }

  if (cleaned.startsWith('52')) {
    if (cleaned.length <= 14) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
    }
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`;
  }

  if (cleaned.length <= 13) {
    return `+52 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
  }

  return `+52 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6, 10)}`;
};
