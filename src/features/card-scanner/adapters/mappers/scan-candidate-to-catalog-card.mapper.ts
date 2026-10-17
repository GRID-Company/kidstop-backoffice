import type { ICardCandidate } from '../../domain/types';
import type { IMagicCard, IPokemonCard } from '@/features/catalog/domain/types';

export function mapScanCandidateToPokemonCard(
  candidate: ICardCandidate
): IPokemonCard {
  return {
    guid: candidate.guid,
    name: candidate.name,
    language: candidate.language,
    cardNumber: candidate.collectorNumber,
    setName: candidate.setName,
    setCode: candidate.setCode,
    variant: candidate.variant,
    sellPrice: candidate.sellPrice,
    availableStock: candidate.availableStock,
    totalStock: candidate.totalStock,
    imageUri: candidate.imageUrl,
    variants: [],
  };
}

export function mapScanCandidateToMagicCard(
  candidate: ICardCandidate
): IMagicCard {
  return {
    guid: candidate.guid,
    name: candidate.name,
    language: candidate.language,
    edition: candidate.setName,
    collectorNumber: candidate.collectorNumber,
    isFoil: candidate.isFoil,
    rarity: null,
    sellPrice: candidate.sellPrice,
    availableStock: candidate.availableStock,
    totalStock: candidate.totalStock,
    imageUri: candidate.imageUrl,
    variants: [],
  };
}
