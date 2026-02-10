import { IPurchase } from '../../domain/types';
import { PurchaseFormData } from '../forms/purchase-form.schema';

export function toCreatePurchasePayload(data: PurchaseFormData, tcgType: string) {
  return {
    createPurchaseInput: {
      tcgType,
      sellerId: data.sellerId,
      notes: data.notes || undefined,
      items: data.items.map((item) => ({
        cardId: item.cardId,
        condition: item.condition,
        quantity: item.quantity,
        unitBuyPrice: item.unitBuyPrice,
        unitSellPrice: item.unitSellPrice,
      })),
      payments: data.payments.map((payment) => ({
        method: payment.method,
        amount: payment.amount,
      })),
    },
  };
}

export function toPurchaseFormDefaults(purchase: IPurchase): PurchaseFormData {
  return {
    sellerId: purchase.seller.id,
    items: purchase.items.map((item) => ({
      cardId: item.cardId,
      cardName: item.cardName,
      cardImageUrl: item.cardImageUrl,
      setName: item.setName,
      setCode: item.setCode,
      condition: item.condition,
      quantity: item.quantity,
      unitBuyPrice: item.unitBuyPrice,
      unitSellPrice: item.unitSellPrice,
    })),
    payments: purchase.payments.map((payment) => ({
      method: payment.method,
      amount: payment.amount,
    })),
    notes: purchase.notes || '',
  };
}
