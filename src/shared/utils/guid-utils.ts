import { CardCondition } from '@/lib/types/card.types';

export function generateTemporaryItemGuid(
  cardGuid: string,
  condition: CardCondition,
  index?: number
): string {
  const base = `temp-${cardGuid}-${condition}`;
  return index !== undefined ? `${base}-${index}` : base;
}
