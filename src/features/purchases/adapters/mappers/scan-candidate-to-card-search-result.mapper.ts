import type { ICardCandidate } from '@/features/card-scanner/domain/types';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { ICardSearchResult } from '../../domain/types';

export function mapScanCandidateToCardSearchResult(
  candidate: ICardCandidate
): ICardSearchResult {
  return {
    guid: candidate.guid,
    name: candidate.name,
    setName: candidate.setName ?? '',
    setCode: candidate.setCode ?? '',
    number: candidate.collectorNumber ?? '',
    rarity: '',
    imageUrl: candidate.imageUrl ?? '',
    tcgType: candidate.game === 'magic' ? TCG_TYPES.MAGIC : TCG_TYPES.POKEMON,
    language: candidate.language,
    variant: candidate.variant,
    isFoil: candidate.isFoil,
    collectorNumber: candidate.collectorNumber,
    metrics: {
      referencePrice: candidate.referencePrice ?? candidate.sellPrice ?? 0,
      currentStock: candidate.totalStock,
      lastSaleDate: null,
      daysInInventory: 0,
      wishlistCount: 0,
    },
  };
}
