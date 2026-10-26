'use client';

import { Chip } from '@heroui/react';
import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { formatCurrencyWithPrivacy } from '@/lib/utils/privacy.utils';
import { formatCurrency } from '@/lib/utils/format-currency';
import {
  CARD_CONDITIONS,
  CARD_CONDITION_LABELS,
  CARD_CONDITION_SHORT_LABELS,
} from '../../../domain/constants';
import { calculateGrossMarginPercent } from '../../../domain/catalog.domain';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { CardCondition } from '../../../domain/types';
import { CardLanguage } from '@/lib/api/schema-types';
import type { InventoryCard } from '../../hooks/use-card-detail-modal';

const CONDITION_ORDER = Object.values(CARD_CONDITIONS);

interface ConditionRow {
  condition: string;
  variant: InventoryCard | null;
  primary: boolean;
}

interface InventoryConditionTableProps {
  availableVariants: InventoryCard[];
  selectedVariant: InventoryCard | null;
  selectedLanguage: CardLanguage;
  showAllLanguages?: boolean;
  onVariantSelect: (variant: InventoryCard) => void;
}

export default function InventoryConditionTable({
  availableVariants,
  selectedVariant,
  selectedLanguage,
  showAllLanguages = false,
  onVariantSelect,
}: InventoryConditionTableProps) {
  const isPrivacyMode = usePrivacyModeStore((s) => s.isPrivacyMode);

  const rows: ConditionRow[] = CONDITION_ORDER.flatMap((condition) => {
    const variants = availableVariants.filter((v) => v.condition === condition);
    if (showAllLanguages) {
      return variants.map((variant, index) => ({
        condition,
        variant,
        primary: index === 0,
      }));
    }
    return [{ condition, variant: variants[0] ?? null, primary: true }];
  });

  const isRowSelected = (condition: string, variant: InventoryCard | null) =>
    selectedVariant?.condition === condition &&
    selectedVariant?.language === (variant?.language ?? selectedLanguage);

  return (
    <div
      className='border-default-200 overflow-hidden rounded-xl border bg-white'
      data-testid='condition-stock-table'
    >
      <table className='w-full text-left text-sm'>
        <thead>
          <tr className='border-default-100 text-default-400 border-b text-[10px] tracking-wide uppercase'>
            <th className='px-3 py-2.5 font-medium'>Condición</th>
            <th className='px-3 py-2.5 font-medium'>Idioma</th>
            <th className='px-3 py-2.5 text-right font-medium'>Stock</th>
            <th className='px-3 py-2.5 text-right font-medium'>Costo</th>
            <th className='px-3 py-2.5 text-right font-medium'>Venta</th>
            <th className='px-3 py-2.5 text-right font-medium'>Margen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ condition, variant, primary }) => {
            const isSelected = isRowSelected(condition, variant);
            const margin = calculateGrossMarginPercent(
              variant?.sellPrice,
              variant?.purchasePrice
            );
            const slug = condition.toLowerCase().replace(/_/g, '-');
            const testId = primary
              ? `variant-button-${slug}`
              : `variant-button-${slug}-${variant?.language.toLowerCase()}`;
            return (
              <tr
                key={primary ? condition : `${condition}-${variant?.language}`}
                onClick={() =>
                  onVariantSelect(
                    variant ?? {
                      cardGuid: selectedVariant?.cardGuid ?? '',
                      isNew: true,
                      condition,
                      language: selectedVariant?.language ?? selectedLanguage,
                      stock: 0,
                      purchasePrice: null,
                      sellPrice: null,
                    }
                  )
                }
                className={`cursor-pointer border-b border-transparent transition-colors last:border-0 ${
                  isSelected ? 'bg-accent-soft' : 'hover:bg-default-50'
                }`}
                data-testid={testId}
                data-stock={variant?.stock ?? 0}
              >
                <td className='px-3 py-2.5'>
                  <span className='flex items-center gap-2'>
                    <Chip
                      size='sm'
                      variant='flat'
                      radius='sm'
                      classNames={{
                        base: isSelected ? 'bg-accent' : undefined,
                        content: `font-semibold ${isSelected ? 'text-white' : ''}`,
                      }}
                    >
                      {CARD_CONDITION_SHORT_LABELS[condition as CardCondition]}
                    </Chip>
                    <span className='text-default-600 hidden text-xs sm:inline'>
                      {CARD_CONDITION_LABELS[condition as CardCondition]}
                    </span>
                  </span>
                </td>
                <td className='text-default-500 px-3 py-2.5 text-xs'>
                  {variant
                    ? (LANGUAGE_LABELS[variant.language] ?? variant.language)
                    : '—'}
                </td>
                <td
                  className={`px-3 py-2.5 text-right font-semibold ${
                    variant && variant.stock > 0
                      ? 'text-default-800'
                      : 'text-default-300'
                  }`}
                >
                  {variant?.stock ?? 0}
                </td>
                <td className='text-default-600 px-3 py-2.5 text-right'>
                  {variant?.purchasePrice != null
                    ? formatCurrencyWithPrivacy(
                        variant.purchasePrice,
                        isPrivacyMode
                      )
                    : '—'}
                </td>
                <td className='px-3 py-2.5 text-right font-semibold'>
                  {variant?.sellPrice != null
                    ? formatCurrency(variant.sellPrice)
                    : '—'}
                </td>
                <td className='text-default-600 px-3 py-2.5 text-right'>
                  {margin != null ? `${margin.toFixed(0)}%` : '—'}
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className='text-default-400 px-3 py-6 text-center text-sm'
              >
                Sin unidades en inventario
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
