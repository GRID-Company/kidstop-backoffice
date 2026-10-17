import type {
  MagicCardScanSearchQuery,
  PokemonCardScanSearchQuery,
} from '@/lib/api/generated/card-scan-search.generated';
import type {
  ICardCandidate,
  ICardScanAiResolved,
  ICardSearchResponse,
} from '../../domain/types';

type PokemonScanItem =
  | NonNullable<
      PokemonCardScanSearchQuery['pokemonCardScanSearch']['bestMatch']
    >
  | PokemonCardScanSearchQuery['pokemonCardScanSearch']['relatedCards'][number];

type MagicScanItem =
  | NonNullable<MagicCardScanSearchQuery['magicCardScanSearch']['bestMatch']>
  | MagicCardScanSearchQuery['magicCardScanSearch']['relatedCards'][number];

type AiResolvedApi = NonNullable<
  PokemonCardScanSearchQuery['pokemonCardScanSearch']['aiResolved']
>;

const mapPokemonItemToCandidate = (
  item: PokemonScanItem,
  isBestMatch: boolean
): ICardCandidate => ({
  guid: item.guid,
  game: 'pokemon',
  name: item.name,
  setName: item.setName,
  setCode: item.setCode,
  collectorNumber: item.cardNumber,
  imageUrl: item.imageUri,
  language: item.language,
  isFoil: false,
  variant: item.variant,
  sellPrice: item.sellPrice,
  referencePrice:
    ('cardMetrics' in item ? item.cardMetrics?.ungradedPrice : null) ??
    item.sellPrice,
  totalStock: item.totalStock,
  availableStock: item.availableStock,
  isBestMatch,
});

const mapMagicItemToCandidate = (
  item: MagicScanItem,
  isBestMatch: boolean
): ICardCandidate => ({
  guid: item.guid,
  game: 'magic',
  name: item.name,
  setName: item.edition,
  setCode: null,
  collectorNumber: item.collectorNumber,
  imageUrl: item.imageUri,
  language: item.language,
  isFoil: item.isFoil,
  variant: null,
  sellPrice: item.sellPrice,
  referencePrice:
    ('cardMetrics' in item ? item.cardMetrics?.priceRetail : null) ??
    item.sellPrice,
  totalStock: item.totalStock,
  availableStock: item.availableStock,
  isBestMatch,
});

const mapAiResolvedFromApi = (api: AiResolvedApi): ICardScanAiResolved => ({
  name: api.name,
  nameEs: api.nameEs,
  cardNumber: api.cardNumber,
  setCode: api.setCode,
  setName: api.setName,
  setNameEs: api.setNameEs,
  cardText: api.cardText,
  cardTextEs: api.cardTextEs,
  detectedLanguage: api.detectedLanguage,
});

export const mapPokemonScanResultFromApi = (
  result: PokemonCardScanSearchQuery['pokemonCardScanSearch']
): ICardSearchResponse => {
  const bestMatch = result.bestMatch
    ? mapPokemonItemToCandidate(result.bestMatch, true)
    : null;

  return {
    resolvedByAI: result.resolvedByAI,
    bestMatch,
    candidates: [
      ...(bestMatch ? [bestMatch] : []),
      ...result.relatedCards.map((item) =>
        mapPokemonItemToCandidate(item, false)
      ),
    ],
    aiResolved: result.aiResolved
      ? mapAiResolvedFromApi(result.aiResolved)
      : null,
    error: result.error,
  };
};

export const mapMagicScanResultFromApi = (
  result: MagicCardScanSearchQuery['magicCardScanSearch']
): ICardSearchResponse => {
  const bestMatch = result.bestMatch
    ? mapMagicItemToCandidate(result.bestMatch, true)
    : null;

  return {
    resolvedByAI: result.resolvedByAI,
    bestMatch,
    candidates: [
      ...(bestMatch ? [bestMatch] : []),
      ...result.relatedCards.map((item) =>
        mapMagicItemToCandidate(item, false)
      ),
    ],
    aiResolved: result.aiResolved
      ? mapAiResolvedFromApi(result.aiResolved)
      : null,
    error: result.error,
  };
};
