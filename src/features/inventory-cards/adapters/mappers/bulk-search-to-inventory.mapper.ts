import { BulkSearchFormDataInventory } from '@/shared/blocks/bulk-card-search/schemas';
import { BulkCardResult } from '@/shared/blocks/bulk-card-search/types';
import { TCGType } from '@/lib/types/tcg.types';
import {
  BulkLoadInventoryInput,
  BulkOperationType,
  CardLanguage,
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
      // TODO: Agregar selector de idioma (English/Spanish) en UI de búsqueda masiva
      // - Solo habilitado para cartas que tengan language English
      // - Cartas con otros idiomas (Korean, Chinese, Japanese) mantienen su idioma original y selector deshabilitado
      language: CardLanguage.English,
      quantity: cardForm.quantity,
      purchasePrice: 0,
      sellPrice: cardForm.publicPrice,
    })),
  };
}
