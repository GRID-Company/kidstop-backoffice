'use client';

import { useMemo } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { CARD_CONDITION_SHORT_LABELS, CARD_CONDITIONS } from '../../domain/constants';

interface VariantMetric {
  condition?: string | null;
  stock?: number | null;
  wishlistCount?: number | null;
}

interface CardConditionBreakdownPopoverProps {
  variantsMetrics: (VariantMetric | null)[] | null | undefined;
}

export default function CardConditionBreakdownPopover({ 
  variantsMetrics 
}: CardConditionBreakdownPopoverProps) {
  const conditionData = useMemo(() => {
    if (!variantsMetrics || variantsMetrics.length === 0) {
      return [];
    }

    const conditionOrder = [
      CARD_CONDITIONS.NEAR_MINT,
      CARD_CONDITIONS.LIGHTLY_PLAYED,
      CARD_CONDITIONS.MODERATELY_PLAYED,
      CARD_CONDITIONS.HEAVILY_PLAYED,
      CARD_CONDITIONS.DAMAGED,
    ];

    return conditionOrder
      .map((condition) => {
        const metric = variantsMetrics.find((v) => v?.condition === condition);
        if (!metric) return null;

        return {
          condition,
          label: CARD_CONDITION_SHORT_LABELS[condition],
          stock: metric.stock ?? 0,
          wishlistCount: metric.wishlistCount ?? 0,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [variantsMetrics]);

  const totalWishlist = useMemo(() => {
    return conditionData.reduce((sum, item) => sum + item.wishlistCount, 0);
  }, [conditionData]);

  if (conditionData.length === 0) {
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
              {conditionData.map(({ condition, label, stock, wishlistCount }) => (
                <div key={condition} className="flex items-center justify-between gap-6">
                  <span className="text-xs text-default-500">{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Icon icon="lucide:package" width={12} className="text-default-400" />
                      <span className="text-xs font-medium">{stock}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon icon="lucide:heart" width={12} className="text-default-400" />
                      <span className="text-xs font-medium">{wishlistCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {totalWishlist > 0 && (
            <>
              <div className="h-px bg-default-200" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-default-600">Total en wishlist</span>
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
