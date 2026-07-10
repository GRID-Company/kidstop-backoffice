import { CardCondition } from '@/lib/types/card.types';
import { CardLanguage } from '@/lib/api/schema-types';

export function generateTemporaryItemGuid(
  cardGuid: string,
  condition: CardCondition,
  language?: CardLanguage,
  index?: number
): string {
  const lang = language || CardLanguage.English;
  const base = `temp-${cardGuid}-${condition}-${lang}`;
  return index !== undefined ? `${base}-${index}` : base;
}
