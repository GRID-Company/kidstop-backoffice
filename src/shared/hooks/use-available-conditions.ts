import { useMemo } from 'react';
import { CARD_CONDITION_OPTIONS, CardCondition } from '@/lib/types/card.types';

interface ItemWithCondition {
  cardGuid: string;
  guid: string;
  condition: CardCondition;
}

export function useAvailableConditions<T extends ItemWithCondition>(
  item: T,
  allItems: T[]
) {
  const usedConditions = useMemo(() => {
    return new Set(
      allItems
        .filter((i) => i.cardGuid === item.cardGuid && i.guid !== item.guid)
        .map((i) => i.condition)
    );
  }, [allItems, item.cardGuid, item.guid]);

  const availableConditionOptions = useMemo(() => {
    return CARD_CONDITION_OPTIONS.map((option) => ({
      ...option,
      isDisabled: usedConditions.has(option.value),
    }));
  }, [usedConditions]);

  return { usedConditions, availableConditionOptions };
}
