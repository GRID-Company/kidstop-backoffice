'use client';

import { ReactNode } from 'react';
import { Chip, ChipProps } from '@heroui/react';
import CardShell from '@/shared/blocks/card-shell';
import { ConditionSummaryItem } from '@/shared/blocks/card-shell/slots';
import { TCGType } from '@/lib/types/tcg.types';

export interface CatalogCardChip {
  label: string;
  color?: ChipProps['color'];
  icon?: ReactNode;
  accent?: boolean;
}

interface CatalogCardItemProps {
  tcgType: TCGType;
  imageSrc: string | null;
  name: string;
  number?: string | null;
  ident?: string | null;
  subtitle?: string | null;
  chipRows?: CatalogCardChip[][];
  available: boolean;
  priceLabel: string;
  price: number | null;
  stock: number;
  conditionSummary?: ConditionSummaryItem[];
  costPrice?: number | null;
  showCosts?: boolean;
  onDetail?: () => void;
  testId: string;
}

export default function CatalogCardItem({
  tcgType,
  imageSrc,
  name,
  number,
  ident,
  subtitle,
  chipRows = [],
  available,
  priceLabel,
  price,
  stock,
  conditionSummary = [],
  costPrice,
  showCosts,
  onDetail,
  testId,
}: CatalogCardItemProps) {
  return (
    <CardShell
      tcgType={tcgType}
      imageSrc={imageSrc}
      alt={name}
      available={available}
      compact
      showCosts={showCosts}
      testId={`${testId}-item`}
      onPress={onDetail}
    >
      <CardShell.Header>
        <CardShell.Availability testId={`${testId}-availability`} />
        <CardShell.Ident>{ident}</CardShell.Ident>
      </CardShell.Header>

      <CardShell.Image />

      <div className='flex flex-1 flex-col gap-1 px-3 pb-3'>
        <CardShell.Title testId={`${testId}-name`}>
          {name} <CardShell.Number>{number}</CardShell.Number>
        </CardShell.Title>
        <CardShell.Subtitle>{subtitle}</CardShell.Subtitle>

        {chipRows.map(
          (row, rowIndex) =>
            row.length > 0 && (
              <CardShell.ChipRow key={rowIndex}>
                {row.map((chip) => (
                  <Chip
                    key={chip.label}
                    size='sm'
                    variant='flat'
                    color={chip.color ?? 'default'}
                    startContent={chip.icon}
                    className={`h-5 px-1.5 text-[10px] ${
                      chip.accent ? 'bg-accent-soft' : ''
                    }`}
                    classNames={
                      chip.accent ? { content: 'text-accent-text' } : undefined
                    }
                  >
                    {chip.label}
                  </Chip>
                ))}
              </CardShell.ChipRow>
            )
        )}

        <CardShell.PriceBar
          label={priceLabel}
          price={price}
          stock={stock}
          priceTestId={`${testId}-price`}
          stockTestId={`${testId}-stock`}
        />
        <CardShell.ConditionRow items={conditionSummary} />
        <CardShell.CostLine cost={costPrice ?? null} />
      </div>
    </CardShell>
  );
}
