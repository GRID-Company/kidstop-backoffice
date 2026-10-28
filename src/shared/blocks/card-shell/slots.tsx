'use client';

import { PropsWithChildren } from 'react';
import { Chip } from '@heroui/react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatCardNumber } from '@/lib/utils/format-card-number';
import { useCardShell } from './context';

interface SlotProps extends PropsWithChildren {
  className?: string;
  testId?: string;
}

export function Availability({ className, testId }: SlotProps) {
  const { available } = useCardShell();
  return (
    <span
      className={`flex items-center gap-1.5 text-[10px] font-medium ${
        available ? 'text-success-700' : 'text-warning-700'
      } ${className ?? ''}`}
      data-testid={testId}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          available ? 'bg-success' : 'bg-warning'
        }`}
      />
      {available ? 'Disponible' : 'Agotada'}
    </span>
  );
}

export function Ident({ children, className }: SlotProps) {
  if (!children) return null;
  return (
    <span
      className={`text-default-400 max-w-20 truncate text-[10px] ${className ?? ''}`}
      title={typeof children === 'string' ? children : undefined}
    >
      {children}
    </span>
  );
}

export function Header({ children, className }: SlotProps) {
  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 pt-2.5 text-[10px] ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

export function Title({ children, className, testId }: SlotProps) {
  return (
    <p
      className={`text-default-800 line-clamp-2 text-[13px] leading-snug font-semibold ${className ?? ''}`}
      data-testid={testId}
    >
      {children}
    </p>
  );
}

export function Number({ children, className }: SlotProps) {
  if (children == null || children === '') return null;
  const label = formatCardNumber(String(children));
  if (!label) return null;
  return (
    <span className={`text-default-400 font-medium ${className ?? ''}`}>
      {label}
    </span>
  );
}

export function Subtitle({ children, className }: SlotProps) {
  if (!children) return null;
  return (
    <p
      className={`text-default-500 truncate text-[11px] ${className ?? ''}`}
      title={typeof children === 'string' ? children : undefined}
    >
      {children}
    </p>
  );
}

export function ChipRow({ children, className }: SlotProps) {
  if (!children) return null;
  return (
    <div
      className={`flex min-h-5 flex-wrap items-center gap-1 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

interface PriceBarProps {
  label: string;
  price: number | null;
  stock: number;
  className?: string;
  priceTestId?: string;
  stockTestId?: string;
}

export function PriceBar({
  label,
  price,
  stock,
  className,
  priceTestId,
  stockTestId,
}: PriceBarProps) {
  const { compact } = useCardShell();
  return (
    <div
      className={`mt-auto flex items-end justify-between gap-2 ${
        compact ? 'pt-2' : 'pt-3'
      } ${className ?? ''}`}
    >
      <div>
        <span className='text-default-400 block text-[10px]'>{label}</span>
        <span
          className={`text-default-800 font-extrabold tracking-tight ${
            compact ? 'text-base' : 'text-lg'
          }`}
          data-testid={priceTestId}
        >
          {price != null ? formatCurrency(price) : '—'}
        </span>
      </div>
      <div className='text-right'>
        <span className='text-default-400 block text-[10px]'>Stock total</span>
        <span
          className='text-default-700 text-sm font-semibold'
          data-testid={stockTestId}
        >
          {stock}
        </span>
      </div>
    </div>
  );
}

export interface ConditionSummaryItem {
  label: string;
  stock: number;
}

interface ConditionRowProps {
  items: ConditionSummaryItem[];
  className?: string;
}

export function ConditionRow({ items, className }: ConditionRowProps) {
  return (
    <div
      className={`border-default-100 mt-2 flex flex-wrap gap-1 border-t pt-2 ${className ?? ''}`}
    >
      {items.length > 0 ? (
        items.map((item) => (
          <Chip
            key={item.label}
            size='sm'
            variant='flat'
            className='bg-default-100 text-default-500 h-5 px-1.5 text-[10px] font-semibold'
          >
            {item.label} {item.stock}
          </Chip>
        ))
      ) : (
        <span className='text-default-300 text-[10px]'>
          Sin unidades disponibles
        </span>
      )}
    </div>
  );
}

interface CostLineProps {
  cost: number | null;
  className?: string;
}

export function CostLine({ cost, className }: CostLineProps) {
  const { showCosts } = useCardShell();
  if (!showCosts || cost == null) return null;
  return (
    <p className={`text-default-400 text-[10px] ${className ?? ''}`}>
      Costo referencial:{' '}
      <span className='text-default-600 font-semibold'>
        {formatCurrency(cost)}
      </span>
    </p>
  );
}
