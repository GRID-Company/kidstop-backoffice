import type { ICardCandidate } from '@/features/card-scanner/domain/types';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { DEFAULT_CARD_LANGUAGE } from '@/lib/types/language.types';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { generateTemporaryItemGuid } from '@/shared/utils/guid-utils';
import { IPurchaseItem } from '../../domain/types';

export function mapScanCandidateToPurchaseItem(
  candidate: ICardCandidate
): IPurchaseItem {
  const condition = CARD_CONDITIONS.NEAR_MINT;
  const language = candidate.language ?? DEFAULT_CARD_LANGUAGE;
  const referencePrice = candidate.referencePrice ?? candidate.sellPrice ?? 0;

  return {
    guid: generateTemporaryItemGuid(candidate.guid, condition, language),
    cardGuid: candidate.guid,
    cardName: candidate.name,
    cardImageUrl: candidate.imageUrl || '',
    setName: candidate.setName || '',
    setCode: candidate.setCode || '',
    cardNumber: candidate.collectorNumber
      ? `#${candidate.collectorNumber}`
      : undefined,
    tcgType: candidate.game === 'magic' ? TCG_TYPES.MAGIC : TCG_TYPES.POKEMON,
    collectorNumber: candidate.collectorNumber,
    condition,
    language,
    quantity: 1,
    offerPrice: referencePrice,
    referencePrice,
    sellPrice: referencePrice,
  };
}
