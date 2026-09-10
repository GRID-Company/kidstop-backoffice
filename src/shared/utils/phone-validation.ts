/**
 * Valida un número de teléfono mexicano
 * Acepta formatos: +52XXXXXXXXXX, 52XXXXXXXXXX, XXXXXXXXXX (10+ dígitos)
 * @param phone - Teléfono en cualquier formato
 * @returns true si es válido (10+ dígitos)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 10) return false;

  if (cleaned.startsWith('52')) {
    return cleaned.length >= 12;
  }

  return cleaned.length >= 10;
};

/**
 * Normaliza un número de teléfono mexicano a formato: 52XXXXXXXXXX
 * @param phone - Teléfono en cualquier formato
 * @returns Teléfono normalizado sin símbolos, con prefijo 52 si es necesario
 */
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

/**
 * Valida y normaliza un número de teléfono en una sola operación
 * @param phone - Teléfono en cualquier formato
 * @returns true si es válido después de normalización
 */
export const validateAndNormalizePhone = (phone: string): boolean => {
  const normalized = normalizePhoneNumber(phone);
  return validatePhoneNumber(normalized);
};
