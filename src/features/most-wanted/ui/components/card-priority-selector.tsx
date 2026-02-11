'use client';

import { Controller, FieldValues } from 'react-hook-form';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ControlWithFormProps } from '@/lib/types/controller.types';
import {
  MOST_WANTED_PRIORITY_OPTIONS,
  MOST_WANTED_PRIORITIES,
} from '../../domain/constants';
import { MostWantedPriority } from '../../domain/types';

const PRIORITY_CONFIG: Record<
  MostWantedPriority,
  { icon: string; color: string; activeClass: string }
> = {
  [MOST_WANTED_PRIORITIES.HIGH]: {
    icon: 'lucide:chevrons-up',
    color: 'text-danger',
    activeClass: 'bg-danger text-white',
  },
  [MOST_WANTED_PRIORITIES.MEDIUM]: {
    icon: 'lucide:chevron-up',
    color: 'text-warning',
    activeClass: 'bg-warning text-white',
  },
  [MOST_WANTED_PRIORITIES.LOW]: {
    icon: 'lucide:chevron-down',
    color: 'text-default-400',
    activeClass: 'bg-default-400 text-white',
  },
};

interface CardPrioritySelectorProps<T extends FieldValues> {
  controlProps: ControlWithFormProps<T>;
  label?: string;
}

export default function CardPrioritySelector<T extends FieldValues>({
  controlProps,
  label,
}: CardPrioritySelectorProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className="flex flex-col gap-2">
          {label && (
            <span className="text-sm font-medium text-default-700">
              {label}
            </span>
          )}

          <div className="flex gap-2">
            {MOST_WANTED_PRIORITY_OPTIONS.map((option) => {
              const config = PRIORITY_CONFIG[option.value as MostWantedPriority];
              const isSelected = value === option.value;

              return (
                <Button
                  key={option.value}
                  size="sm"
                  variant={isSelected ? 'solid' : 'bordered'}
                  className={
                    isSelected
                      ? config.activeClass
                      : `border-default-200 ${config.color}`
                  }
                  startContent={<Icon icon={config.icon} width={16} />}
                  onPress={() => onChange(option.value)}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>

          {error?.message && (
            <span className="text-xs text-danger">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}
