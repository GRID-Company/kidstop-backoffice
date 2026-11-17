'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  PurchaseItemsView,
  usePurchaseItemsViewStore,
} from '@/lib/store/purchase-items-view';

const VIEW_OPTIONS: {
  key: PurchaseItemsView;
  icon: string;
  label: string;
}[] = [
  { key: 'cards', icon: 'lucide:layout-grid', label: 'Cartas' },
  { key: 'table', icon: 'lucide:table', label: 'Tabla' },
];

export default function PurchaseItemsViewToggle() {
  const view = usePurchaseItemsViewStore((state) => state.view);
  const setView = usePurchaseItemsViewStore((state) => state.setView);

  return (
    <div
      className='border-default-200 flex items-center gap-0.5 rounded-lg border p-1'
      data-testid='purchase-items-view-toggle'
      role='group'
      aria-label='Tipo de visualización'
    >
      {VIEW_OPTIONS.map((option) => {
        const isActive = view === option.key;
        return (
          <Button
            key={option.key}
            size='sm'
            isIconOnly
            variant={isActive ? 'solid' : 'light'}
            className={isActive ? 'bg-accent text-white' : 'text-default-500'}
            aria-label={option.label}
            aria-pressed={isActive}
            data-testid={`purchase-items-view-${option.key}`}
            onPress={() => setView(option.key)}
          >
            <Icon icon={option.icon} width={18} />
          </Button>
        );
      })}
    </div>
  );
}
