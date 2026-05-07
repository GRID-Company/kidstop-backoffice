import { formatCurrency } from '@/lib/utils/format-currency';
import { ISale, ISaleItem } from './types';

export const calculateItemSubtotal = (item: ISaleItem): number => {
  return item.price * item.quantity;
};

export const calculateTotal = (items: ISaleItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const formatSaleTotal = (items: ISaleItem[]): string => {
  return formatCurrency(calculateTotal(items));
};

const sanitizePhone = (phone: string): string =>
  phone.replace(/[^0-9]/g, '');

export interface WhatsAppReadyParams {
  sale: ISale;
  customerPhone: string;
}

export const buildWhatsAppReadyMessage = (params: WhatsAppReadyParams): string => {
  const { sale, customerPhone } = params;
  const customerName = sale.customer?.name || sale.kioskCustomerName || 'Cliente';

  return [
    `Hola *${customerName}*`,
    ``,
    `Tu pedido *${sale.saleCode}* está listo para recoger en Kidstop.`,
    ``,
    `¡Te esperamos!`,
  ].join('\n');
};

export const buildWhatsAppReadyUrl = (params: WhatsAppReadyParams): string => {
  const phone = sanitizePhone(params.customerPhone);
  const text = buildWhatsAppReadyMessage(params);

  const url = new URL('https://api.whatsapp.com/send/');
  url.searchParams.set('phone', phone);
  url.searchParams.set('text', text);
  url.searchParams.set('type', 'phone_number');
  url.searchParams.set('app_absent', '0');

  return url.toString();
};
