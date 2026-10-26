'use client';

import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import {
  formatCurrencyWithPrivacy,
  REDACTED_VALUE,
} from '@/lib/utils/privacy.utils';
import { formatCurrency } from '@/lib/utils/format-currency';
import { calculateGrossMarginPercent } from '../../../domain/catalog.domain';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className='border-default-200 rounded-xl border bg-white p-3.5'>
      <span className='text-default-400 block text-[10px]'>{label}</span>
      <span className='text-default-800 block text-lg font-extrabold tracking-tight'>
        {value}
      </span>
      {hint && (
        <span className='text-default-400 block text-[10px]'>{hint}</span>
      )}
    </div>
  );
}

interface DetailStatsRowProps {
  totalStock: number;
  sellPrice: number | null;
  purchasePrice: number | null;
}

export default function DetailStatsRow({
  totalStock,
  sellPrice,
  purchasePrice,
}: DetailStatsRowProps) {
  const isPrivacyMode = usePrivacyModeStore((s) => s.isPrivacyMode);

  const marginPercent = calculateGrossMarginPercent(sellPrice, purchasePrice);

  return (
    <div
      className='grid grid-cols-2 gap-2.5 sm:grid-cols-4'
      data-testid='card-detail-stats'
    >
      <StatCard label='Stock total' value={String(totalStock)} hint='uds' />
      <StatCard
        label='Precio venta'
        value={sellPrice != null ? formatCurrency(sellPrice) : '—'}
        hint='condición seleccionada'
      />
      <StatCard
        label='Costo adquisición'
        value={
          purchasePrice != null
            ? formatCurrencyWithPrivacy(purchasePrice, isPrivacyMode)
            : '—'
        }
      />
      <StatCard
        label='Margen bruto'
        value={
          marginPercent != null
            ? isPrivacyMode
              ? REDACTED_VALUE
              : `${marginPercent.toFixed(0)}%`
            : '—'
        }
      />
    </div>
  );
}
