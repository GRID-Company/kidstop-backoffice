import { BulkSearchFormDataInventory } from '@/shared/blocks/bulk-card-search/schemas';
import { TCGType } from '@/lib/types/tcg.types';

export interface BulkLoadInventoryItemInput {
  cardGuid: string;
  tcg: TCGType;
  condition: string;
  stock: number;
  purchasePrice: number;
  sellPrice: number;
}

export interface BulkLoadInventoryInput {
  items: BulkLoadInventoryItemInput[];
}

export function mapBulkSearchToInventoryInput(
  formData: BulkSearchFormDataInventory,
  tcgType: TCGType
): BulkLoadInventoryInput {
  return {
    items: formData.cards.map((cardForm) => ({
      cardGuid: cardForm.selectedCardGuid,
      tcg: tcgType,
      condition: cardForm.condition,
      stock: cardForm.quantity,
      purchasePrice: 0,
      sellPrice: cardForm.publicPrice,
    })),
  };
}
