import { BulkSearchFormDataPurchases } from '@/shared/blocks/bulk-card-search/schemas';
import { BulkCardResult } from '@/shared/blocks/bulk-card-search/types';
import { IPurchaseItem } from '../../domain/types';
import { TCGType } from '@/lib/types/tcg.types';

export function mapBulkSearchToPurchaseItems(
  formData: BulkSearchFormDataPurchases,
  results: BulkCardResult[],
  tcgType: TCGType
): IPurchaseItem[] {
  return formData.cards.map((cardForm, index) => {
    const result = results[index];
    const selectedCard =
      result?.bestMatch?.guid === cardForm.selectedCardGuid
        ? result.bestMatch
        : result?.relatedCards.find((c) => c.guid === cardForm.selectedCardGuid) ||
          result?.bestMatch;

    if (!selectedCard) {
      throw new Error(`Card not found for index ${index}`);
    }

    const referencePrice = selectedCard.referencePrice || selectedCard.sellPrice || 0;

    return {
      guid: `${selectedCard.guid}-${cardForm.condition}-${Date.now()}-${index}`,
      cardGuid: selectedCard.guid,
      cardName: selectedCard.name,
      cardImageUrl: selectedCard.imageUri || '',
      setName: selectedCard.edition,
      setCode: selectedCard.collectorNumber,
      tcgType,
      condition: cardForm.condition,
      quantity: cardForm.quantity,
      offerPrice: cardForm.offerPrice,
      referencePrice,
      sellPrice: referencePrice,
    };
  });
}
