'use client';

import { Icon } from '@iconify/react';
import { CARD_CONDITION_OPTIONS } from '@/lib/types/card.types';

interface CardVariant {
  condition: string;
  stock: number;
}

interface ConditionSelectorProps<T extends { variants: CardVariant[] }> {
  card: T;
  onConditionSelect: (condition: string) => void;
}

export default function ConditionSelector<T extends { variants: CardVariant[] }>({
  card,
  onConditionSelect,
}: ConditionSelectorProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Selecciona la condición</p>
      <div className="grid grid-cols-2 gap-2">
        {CARD_CONDITION_OPTIONS.map((option) => {
          const variant = card.variants.find((v) => v.condition === option.value);
          const stock = variant?.stock ?? 0;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onConditionSelect(option.value)}
              className="flex items-center justify-between rounded-lg border border-default-200 p-3 text-left transition hover:bg-default-50"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs text-default-500">Stock: {stock}</p>
              </div>
              <Icon icon="lucide:chevron-right" className="text-default-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
