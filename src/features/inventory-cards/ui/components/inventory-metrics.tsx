'use client';

import { CardBody, Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import KidstopCard from '@/shared/base/heorui-overrides/card';

interface InventoryMetricsProps {
  totalStock: number;
  lastSellDate: string | null;
  avgDaysInInventory: number | null;
  loading?: boolean;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Sin datos';
  return new Date(Number(dateStr)).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDays(days: number | null): string {
  if (days == null) return 'Sin datos';
  return `${days.toFixed(1)} días`;
}

const METRIC_CARDS = [
  {
    key: 'totalStock' as const,
    label: 'Total en stock',
    icon: 'lucide:package',
  },
  {
    key: 'lastSellDate' as const,
    label: 'Última venta',
    icon: 'lucide:calendar-clock',
  },
  {
    key: 'avgDaysInInventory' as const,
    label: 'Tiempo promedio en inventario',
    icon: 'lucide:timer',
  },
];

function formatMetric(key: string, value: number | string | null): string {
  if (key === 'totalStock') return (value as number).toLocaleString('es-MX');
  if (key === 'lastSellDate') return formatDate(value as string | null);
  if (key === 'avgDaysInInventory') return formatDays(value as number | null);
  return String(value ?? '—');
}

export default function InventoryMetrics({
  totalStock,
  lastSellDate,
  avgDaysInInventory,
  loading = false,
}: InventoryMetricsProps) {
  const values: Record<string, number | string | null> = {
    totalStock,
    lastSellDate,
    avgDaysInInventory,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {METRIC_CARDS.map((card) => (
        <KidstopCard key={card.key}>
          <CardBody className="flex flex-row items-center gap-4 !p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Icon icon={card.icon} className="text-xl text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-default-400">{card.label}</p>
              {loading ? (
                <Skeleton className="mt-1 h-6 w-24 rounded" />
              ) : (
                <p className="truncate text-lg font-semibold">
                  {formatMetric(card.key, values[card.key])}
                </p>
              )}
            </div>
          </CardBody>
        </KidstopCard>
      ))}
    </div>
  );
}
