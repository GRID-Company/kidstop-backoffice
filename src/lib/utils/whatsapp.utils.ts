export const sanitizePhone = (phone: string): string =>
  phone.replace(/[^0-9]/g, '');

export const buildWhatsAppUrl = (phone: string, message: string): string => {
  const sanitized = sanitizePhone(phone);
  const url = new URL('https://api.whatsapp.com/send/');
  url.searchParams.set('phone', sanitized);
  url.searchParams.set('text', message);
  url.searchParams.set('type', 'phone_number');
  url.searchParams.set('app_absent', '0');
  return url.toString();
};
