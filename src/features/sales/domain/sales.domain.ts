import { formatCurrency } from '@/lib/utils/format-currency';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp.utils';
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

export interface WhatsAppReadyParams {
  sale: ISale;
  customerPhone: string;
}

export const buildWhatsAppReadyMessage = (params: WhatsAppReadyParams): string => {
  const { sale } = params;
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
  const text = buildWhatsAppReadyMessage(params);
  return buildWhatsAppUrl(params.customerPhone, text);
};
