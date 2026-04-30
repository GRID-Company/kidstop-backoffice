import { BulkSearchFormDataInventory } from '@/shared/blocks/bulk-card-search/schemas';
import { BulkCardResult } from '@/shared/blocks/bulk-card-search/types';
import { TCGType } from '@/lib/types/tcg.types';
import {
  BulkLoadInventoryInput,
  BulkOperationType,
} from '@/lib/api/schema-types';

export function mapBulkSearchToInventoryInput(
  formData: BulkSearchFormDataInventory,
  results: BulkCardResult[],
  tcgType: TCGType,
  bulkOperationType: BulkOperationType
): BulkLoadInventoryInput {
  return {
    bulkOperationType,
    items: formData.cards.map((cardForm) => ({
      cardGuid: cardForm.selectedCardGuid,
      tcg: tcgType,
      condition: cardForm.condition,
      quantity: cardForm.quantity,
      purchasePrice: 0,
      sellPrice: cardForm.publicPrice,
    })),
  };
}
