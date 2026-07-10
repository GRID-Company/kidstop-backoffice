import { CardCondition } from '@/lib/types/card.types';
import { CardLanguage } from '@/lib/api/schema-types';
import { DEFAULT_CARD_LANGUAGE } from '@/lib/types/language.types';

export function generateTemporaryItemGuid(
  cardGuid: string,
  condition: CardCondition,
  language?: CardLanguage,
  index?: number
): string {
  const lang = language || DEFAULT_CARD_LANGUAGE;
  const base = `temp-${cardGuid}-${condition}-${lang}`;
  return index !== undefined ? `${base}-${index}` : base;
}
