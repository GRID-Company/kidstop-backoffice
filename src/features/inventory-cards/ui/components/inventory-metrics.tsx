'use client';

import { useMemo } from 'react';
import { CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { IInventoryItem } from '../../domain/types';
import { calculateInventoryMetrics } from '../../domain/inventory.domain';

interface InventoryMetricsProps {
  items: IInventoryItem[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Sin datos';
  return new Date(dateStr).toLocaleDateString('es-MX', {
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
    key: 'totalStock',
    label: 'Total en stock',
    icon: 'lucide:package',
    format: (value: number) => value.toLocaleString('es-MX'),
  },
  {
    key: 'lastSoldAt',
    label: 'Última venta',
    icon: 'lucide:calendar-clock',
    format: (value: string | null) => formatDate(value),
  },
  {
    key: 'avgDaysInInventory',
    label: 'Tiempo promedio en inventario',
    icon: 'lucide:timer',
    format: (value: number | null) => formatDays(value),
  },
] as const;

export default function InventoryMetrics({ items }: InventoryMetricsProps) {
  const metrics = useMemo(() => calculateInventoryMetrics(items), [items]);

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
              <p className="truncate text-lg font-semibold">
                {card.format(metrics[card.key] as never)}
              </p>
            </div>
          </CardBody>
        </KidstopCard>
      ))}
    </div>
  );
}
