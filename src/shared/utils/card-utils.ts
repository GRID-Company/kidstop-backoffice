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

export function getCardName(item: CardSummary): string {
  return item.pokemonCardSummary?.name ?? item.magicCardSummary?.name ?? '—';
}

export function getCardImageUri(item: CardSummary): string | null {
  return item.pokemonCardSummary?.imageUri ?? item.magicCardSummary?.imageUri ?? null;
}

export function getCardTCG(item: CardSummary): 'POKEMON' | 'MAGIC' {
  return item.pokemonCardSummary ? 'POKEMON' : 'MAGIC';
}

export function getSetInfo(item: CardSummary): string {
  if (item.pokemonCardSummary) {
    const { setName, setCode } = item.pokemonCardSummary;
    return setName && setCode ? `${setName} (${setCode})` : setName ?? '—';
  }
  if (item.magicCardSummary) {
    const { edition, collectorNumber } = item.magicCardSummary;
    return edition && collectorNumber
      ? `${edition} #${collectorNumber}`
      : edition ?? '—';
  }
  return '—';
}
