import type { ICardCandidate } from '../../domain/types';
import type { BulkCardData } from '@/shared/blocks/bulk-card-search/types';

export function mapScanCandidateToBulkCard(
  candidate: ICardCandidate
): BulkCardData {
  return {
    guid: candidate.guid,
    name: candidate.name,
    edition: candidate.setName ?? '',
    collectorNumber: candidate.collectorNumber ?? '',
    isFoil: candidate.isFoil,
    variant: candidate.variant,
    language: candidate.language,
    sellPrice: candidate.sellPrice,
    totalStock: candidate.totalStock,
    availableStock: candidate.availableStock,
    imageUri: candidate.imageUrl,
    inventoryCards: [],
    referencePrice: candidate.referencePrice,
  };
}
