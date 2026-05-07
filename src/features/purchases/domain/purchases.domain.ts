import { IPaginatedApiArgs } from '@/lib/types/datatable.types';
import { CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { TCGType } from '@/lib/types/tcg.types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp.utils';
import { DEFAULT_BUDGET_LIMIT, DEFAULT_INVENTORY_LIMIT } from './constants';
import { IPaymentDetail, IPurchaseItem, ISeller, PurchaseFilters } from './types';

export const getPurchasesVars = (
  args: IPaginatedApiArgs,
  filters: PurchaseFilters
) => {
  return {
    findPurchasesArgs: {
      ...args,
      filters: {
        tcg: filters.tcgType,
        status: filters.status || undefined,
        buyer: filters.buyerGuid || undefined,
      },
      search: filters.search || undefined,
    },
  };
};

export const calculateItemSubtotal = (item: IPurchaseItem): number => {
  return item.offerPrice * item.quantity;
};

export const calculateTotal = (items: IPurchaseItem[]): number => {
  return items.reduce(
    (total, item) => total + item.offerPrice * item.quantity,
    0
  );
};

export const calculateSellTotal = (items: IPurchaseItem[]): number => {
  return items.reduce(
    (total, item) => total + (item.sellPrice ?? 0) * item.quantity,
    0
  );
};

export interface BudgetCheckResult {
  withinBudget: boolean;
  currentSpent: number;
  purchaseTotal: number;
  budgetLimit: number;
  remaining: number;
}

export const checkBudget = (
  items: IPurchaseItem[],
  currentSpent: number,
  budgetLimit: number = DEFAULT_BUDGET_LIMIT
): BudgetCheckResult => {
  const purchaseTotal = calculateTotal(items);
  const remaining = budgetLimit - currentSpent - purchaseTotal;

  return {
    withinBudget: remaining >= 0,
    currentSpent,
    purchaseTotal,
    budgetLimit,
    remaining,
  };
};

export interface InventoryLimitCheckResult {
  withinLimit: boolean;
  cardGuid: string;
  cardName: string;
  currentStock: number;
  purchaseQuantity: number;
  inventoryLimit: number;
}

export const checkInventoryLimit = (
  item: IPurchaseItem,
  currentStock: number,
  inventoryLimit: number = DEFAULT_INVENTORY_LIMIT
): InventoryLimitCheckResult => {
  const totalAfterPurchase = currentStock + item.quantity;

  return {
    withinLimit: totalAfterPurchase <= inventoryLimit,
    cardGuid: item.cardGuid,
    cardName: item.cardName,
    currentStock,
    purchaseQuantity: item.quantity,
    inventoryLimit,
  };
};

const TCG_LABELS: Record<TCGType, string> = {
  POKEMON: 'Pokémon',
  MAGIC: 'Magic: The Gathering',
};

export interface WhatsAppQuoteParams {
  seller: ISeller;
  items: IPurchaseItem[];
  tcgType: TCGType;
}

export const buildWhatsAppQuoteMessage = (params: WhatsAppQuoteParams): string => {
  const { seller, items, tcgType } = params;
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = calculateTotal(items);

  const itemLines = items
    .map((item) => {
      const condition = CARD_CONDITION_SHORT_LABELS[item.condition];
      const subtotal = item.offerPrice * item.quantity;
      return [
        `  • *${item.cardName}* (${condition})`,
        `    ${item.setName} · ${item.setCode}`,
        `    Cant: ${item.quantity} × ${formatCurrency(item.offerPrice)} = ${formatCurrency(subtotal)}`,
      ].join('\n');
    })
    .join('\n\n');

  return [
    `Hola *${seller.name}*`,
    `Te comparto la *cotización de compra*:\n`,
    `*TCG:* ${TCG_LABELS[tcgType]}`,
    `*Cartas:* ${totalQty}\n`,
    itemLines,
    `\n*Total:* ${formatCurrency(total)}`,
  ].join('\n');
};

export const buildWhatsAppQuoteUrl = (params: WhatsAppQuoteParams): string => {
  const text = buildWhatsAppQuoteMessage(params);
  return buildWhatsAppUrl(params.seller.phone, text);
};

export interface WhatsAppQuoteValidation {
  valid: boolean;
  errors: string[];
}

export interface PaymentSplitValidation {
  valid: boolean;
  totalRequired: number;
  totalAssigned: number;
  difference: number;
  errors: string[];
}

export const validatePaymentSplit = (
  items: IPurchaseItem[],
  payments: IPaymentDetail[]
): PaymentSplitValidation => {
  const errors: string[] = [];
  const totalRequired = calculateTotal(items);
  const totalAssigned = payments.reduce((sum, p) => sum + p.amount, 0);
  const difference = totalRequired - totalAssigned;

  if (payments.length === 0) {
    errors.push('Debe agregar al menos un método de pago');
  }

  payments.forEach((payment, index) => {
    if (payment.amount <= 0) {
      errors.push(`El monto del pago ${index + 1} debe ser mayor a 0`);
    }
  });

  const methods = payments.map((p) => p.method);
  const uniqueMethods = new Set(methods);
  if (uniqueMethods.size !== methods.length) {
    errors.push('No se puede repetir el mismo método de pago');
  }

  if (Math.abs(difference) > 0.01) {
    errors.push(
      difference > 0
        ? `Faltan ${formatCurrency(difference)} por asignar`
        : `Se excede por ${formatCurrency(Math.abs(difference))}`
    );
  }

  return {
    valid: errors.length === 0,
    totalRequired,
    totalAssigned,
    difference,
    errors,
  };
};

export interface PriceAdjustmentValidation {
  valid: boolean;
  errors: string[];
  itemsWithoutPrice: string[];
}

export const validatePriceAdjustment = (
  items: IPurchaseItem[],
  adjustedPrices: Record<string, number>
): PriceAdjustmentValidation => {
  const errors: string[] = [];
  const itemsWithoutPrice: string[] = [];

  if (items.length === 0) {
    errors.push('No hay items para ajustar');
  }

  items.forEach((item) => {
    const price = adjustedPrices[item.guid];
    if (price === undefined || price <= 0) {
      itemsWithoutPrice.push(item.guid);
    }
  });

  if (itemsWithoutPrice.length > 0) {
    errors.push(
      `${itemsWithoutPrice.length} item(s) sin precio público definido`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    itemsWithoutPrice,
  };
};

export const validateWhatsAppQuote = (params: Partial<WhatsAppQuoteParams>): WhatsAppQuoteValidation => {
  const errors: string[] = [];

  if (!params.seller) {
    errors.push('Debe seleccionar un vendedor');
  } else if (!params.seller.phone) {
    errors.push('El vendedor no tiene teléfono registrado');
  }

  if (!params.items || params.items.length === 0) {
    errors.push('Debe agregar al menos una carta');
  }

  if (!params.tcgType) {
    errors.push('Debe seleccionar un TCG');
  }

  return { valid: errors.length === 0, errors };
};
