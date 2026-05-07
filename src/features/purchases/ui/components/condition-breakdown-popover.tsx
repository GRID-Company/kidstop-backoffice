'use client';

import { useMemo } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { IPurchaseItem, CardCondition } from '../../domain/types';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';

interface ConditionBreakdownPopoverProps {
  items: IPurchaseItem[];
}

export default function ConditionBreakdownPopover({ items }: ConditionBreakdownPopoverProps) {
  const conditionBreakdown = useMemo(() => {
    const breakdown = new Map<CardCondition, number>();
    
    items.forEach((item) => {
      const current = breakdown.get(item.condition) || 0;
      breakdown.set(item.condition, current + item.quantity);
    });
    
    return Array.from(breakdown.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([condition, count]) => ({
        condition,
        count,
        label: CARD_CONDITION_SHORT_LABELS[condition],
      }));
  }, [items]);

  const totalWishlist = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + (item.metrics?.wishlistCount || 0);
    }, 0);
  }, [items]);

  if (conditionBreakdown.length === 0) {
    return null;
  }

  return (
    <Popover placement="bottom" showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="h-6 w-6 min-w-6"
          aria-label="Ver desglose de condiciones"
        >
          <Icon icon="lucide:info" width={14} className="text-default-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-default-600">
              Desglose por condición
            </span>
            <div className="flex flex-col gap-1.5">
              {conditionBreakdown.map(({ condition, count, label }) => (
                <div key={condition} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-default-500">{label}</span>
                  <Chip size="sm" variant="flat" className="h-5 min-w-8 px-2">
                    <span className="text-xs font-medium">{count}</span>
                  </Chip>
                </div>
              ))}
            </div>
          </div>
          
          {totalWishlist > 0 && (
            <>
              <div className="h-px bg-default-200" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-default-500">Total en wishlist</span>
                <Chip size="sm" variant="flat" color="primary" className="h-5 min-w-8 px-2">
                  <span className="text-xs font-medium">{totalWishlist}</span>
                </Chip>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
