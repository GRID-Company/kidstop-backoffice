export type CardSummary = {
  pokemonCardSummary?: {
    name: string;
    imageUri?: string | null;
    setName?: string | null;
    setCode?: string | null;
  } | null;
  magicCardSummary?: {
    name: string;
    imageUri?: string | null;
    edition?: string | null;
    collectorNumber?: string | null;
  } | null;
};

export type CardData = CardSummary | {
  cardName?: string;
  cardImageUrl?: string;
  tcgType?: string;
  tcg?: string;
  setName?: string;
  setCode?: string;
  edition?: string;
  collectorNumber?: string;
  pokemonCardSummary?: any;
  magicCardSummary?: any;
};

export function getCardName(item: CardData): string {
  if ('pokemonCardSummary' in item && item.pokemonCardSummary) {
    return item.pokemonCardSummary.name ?? '—';
  }
  if ('magicCardSummary' in item && item.magicCardSummary) {
    return item.magicCardSummary.name ?? '—';
  }
  if ('cardName' in item && item.cardName) {
    return item.cardName;
  }
  return '—';
}

export function getCardImageUri(item: CardData): string | null {
  if ('pokemonCardSummary' in item && item.pokemonCardSummary) {
    return item.pokemonCardSummary.imageUri ?? null;
  }
  if ('magicCardSummary' in item && item.magicCardSummary) {
    return item.magicCardSummary.imageUri ?? null;
  }
  if ('cardImageUrl' in item && item.cardImageUrl) {
    return item.cardImageUrl;
  }
  return null;
}

export function getCardTCG(item: CardData): 'POKEMON' | 'MAGIC' {
  if ('pokemonCardSummary' in item && item.pokemonCardSummary) {
    return 'POKEMON';
  }
  if ('magicCardSummary' in item && item.magicCardSummary) {
    return 'MAGIC';
  }
  if ('tcgType' in item && item.tcgType) {
    return item.tcgType as 'POKEMON' | 'MAGIC';
  }
  if ('tcg' in item && item.tcg) {
    return item.tcg as 'POKEMON' | 'MAGIC';
  }
  return 'POKEMON';
}

export function getSetInfo(item: CardData): string {
  if ('pokemonCardSummary' in item && item.pokemonCardSummary) {
    const { setName, setCode } = item.pokemonCardSummary;
    return setName && setCode ? `${setName} (${setCode})` : setName ?? '—';
  }
  if ('magicCardSummary' in item && item.magicCardSummary) {
    const { edition, collectorNumber } = item.magicCardSummary;
    return edition && collectorNumber
      ? `${edition} #${collectorNumber}`
      : edition ?? '—';
  }
  if ('setName' in item && 'setCode' in item && item.setName && item.setCode) {
    return `${item.setName} (${item.setCode})`;
  }
  if ('edition' in item && 'collectorNumber' in item && item.edition && item.collectorNumber) {
    return `${item.edition} #${item.collectorNumber}`;
  }
  return '—';
}
