import type { CreatePurchaseInput, UpdatePurchaseInput } from '@/lib/api/schema-types';
import { IPurchase } from '../../domain/types';
import { PurchaseFormData } from '../forms/purchase-form.schema';

export function toCreatePurchasePayload(data: PurchaseFormData, tcgType: string): { createPurchaseInput: CreatePurchaseInput } {
  return {
    createPurchaseInput: {
      tcg: tcgType,
      sellerGuid: data.sellerGuid,
      notes: data.notes || undefined,
      items: data.items.map((item) => ({
        pokemonCardGuid: item.cardGuid,
        condition: item.condition,
        quantity: item.quantity,
        offerPrice: item.offerPrice,
        referencePrice: item.referencePrice,
      })),
      payments: data.payments?.map((payment) => ({
        method: payment.method,
        amount: payment.amount,
      })),
    },
  };
}

export function toUpdatePurchasePayload(
  purchaseGuid: string,
  data: Partial<PurchaseFormData>
): { updatePurchaseInput: UpdatePurchaseInput } {
  return {
    updatePurchaseInput: {
      purchaseGuid,
      sellerGuid: data.sellerGuid,
      notes: data.notes,
      payments: data.payments?.map((p) => ({
        method: p.method,
        amount: p.amount,
      })),
    },
  };
}

export function toPurchaseFormDefaults(purchase: IPurchase): PurchaseFormData {
  return {
    sellerGuid: purchase.seller.guid,
    items: purchase.items.map((item) => ({
      cardGuid: item.cardGuid,
      cardName: item.cardName,
      cardImageUrl: item.cardImageUrl,
      setName: item.setName,
      setCode: item.setCode,
      condition: item.condition,
      quantity: item.quantity,
      offerPrice: item.offerPrice,
      referencePrice: item.referencePrice,
      sellPrice: item.sellPrice,
    })),
    payments: purchase.payments.map((payment) => ({
      method: payment.method,
      amount: payment.amount,
    })),
    notes: purchase.notes || '',
  };
}
