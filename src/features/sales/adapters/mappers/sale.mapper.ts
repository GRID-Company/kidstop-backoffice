import { ISale } from '../../domain/types';
import { CompleteSaleFormData } from '../forms/complete-sale.form.schema';

export function toCompleteSalePayload(data: CompleteSaleFormData) {
  return {
    completeSaleInput: {
      saleId: data.saleId,
      verifiedItems: data.verifiedItems.map((item) => ({
        itemId: item.itemId,
        verified: item.verified,
      })),
      notes: data.notes || undefined,
    },
  };
}

export function toCompleteSaleFormDefaults(sale: ISale): CompleteSaleFormData {
  return {
    saleId: sale.id,
    status: sale.status,
    verifiedItems: sale.items.map((item) => ({
      itemId: item.id,
      verified: false,
    })),
    notes: sale.notes || '',
  };
}
