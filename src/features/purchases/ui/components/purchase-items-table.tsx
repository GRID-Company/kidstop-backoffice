'use client';

import { useCallback, useMemo } from 'react';
import {
  Button,
  Image,
  Tooltip,
  Select,
  SelectItem,
  Input,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { ITableColumn } from '@/lib/types/datatable.types';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { formatCurrency } from '@/lib/utils/format-currency';
import { CardCondition, IPurchaseItem } from '../../domain/types';
import {
  CARD_CONDITION_OPTIONS,
  CARD_CONDITION_SHORT_LABELS,
} from '../../domain/constants';
import {
  calculateItemSubtotal,
  calculateTotal,
} from '../../domain/purchases.domain';

const REDACTED_VALUE = '$••••••';

interface PurchaseItemsTableProps {
  items: IPurchaseItem[];
  onUpdateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  onRemoveItem: (itemId: string) => void;
  isReadOnly?: boolean;
}

export default function PurchaseItemsTable({
  items,
  onUpdateItem,
  onRemoveItem,
  isReadOnly = false,
}: PurchaseItemsTableProps) {
  const { isPrivacyMode } = usePrivacyModeStore();

  const displayCurrency = useCallback(
    (value: number): string =>
      isPrivacyMode ? REDACTED_VALUE : formatCurrency(value),
    [isPrivacyMode]
  );

  const total = useMemo(() => calculateTotal(items), [items]);

  const handleQuantityChange = useCallback(
    (itemId: string, value: string) => {
      const quantity = parseInt(value, 10);
      if (!isNaN(quantity) && quantity >= 1) {
        onUpdateItem(itemId, { quantity });
      }
    },
    [onUpdateItem]
  );

  const handleConditionChange = useCallback(
    (itemId: string, value: string) => {
      if (value) {
        onUpdateItem(itemId, { condition: value as CardCondition });
      }
    },
    [onUpdateItem]
  );

  const columns: ITableColumn[] = useMemo(() => {
    const baseCols: ITableColumn[] = [
      {
        key: 'card',
        label: 'Carta',
        className: '!text-left min-w-[220px]',
        customCol: (item: IPurchaseItem) => (
          <div className="flex items-center gap-3">
            <Image
              src={item.cardImageUrl || undefined}
              alt={item.cardName}
              className="h-12 w-9 rounded object-cover"
              fallbackSrc="https://placehold.co/36x48?text=Card"
            />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{item.cardName}</span>
              <span className="text-xs text-default-400">
                {item.setName} · {item.setCode}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'condition',
        label: 'Condición',
        className: 'min-w-[160px]',
        customCol: (item: IPurchaseItem) =>
          isReadOnly ? (
            <span className="text-sm">
              {CARD_CONDITION_SHORT_LABELS[item.condition]}
            </span>
          ) : (
            <Select
              aria-label="Condición"
              size="sm"
              variant="bordered"
              selectedKeys={new Set([item.condition])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleConditionChange(item.guid, selected);
              }}
              classNames={{
                trigger: 'border-[1px] bg-white min-w-[140px]',
              }}
            >
              {CARD_CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>
          ),
      },
      {
        key: 'quantity',
        label: 'Cantidad',
        className: 'w-[100px]',
        customCol: (item: IPurchaseItem) =>
          isReadOnly ? (
            <span className="text-sm">{item.quantity}</span>
          ) : (
            <Input
              aria-label="Cantidad"
              type="number"
              size="sm"
              variant="bordered"
              min={1}
              value={String(item.quantity)}
              onValueChange={(val) => handleQuantityChange(item.guid, val)}
              classNames={{
                inputWrapper: 'border-[1px] bg-white w-[80px]',
                input: 'text-center',
              }}
            />
          ),
      },
      {
        key: 'unitBuyPrice',
        label: 'Precio oferta',
        customCol: (item: IPurchaseItem) => (
          <span className="text-sm font-medium">
            {displayCurrency(item.offerPrice)}
          </span>
        ),
      },
      {
        key: 'subtotal',
        label: 'Subtotal',
        customCol: (item: IPurchaseItem) => (
          <span className="text-sm font-semibold">
            {displayCurrency(calculateItemSubtotal(item))}
          </span>
        ),
      },
    ];

    if (!isReadOnly) {
      baseCols.push({
        key: 'actions',
        label: '',
        className: 'w-[60px]',
        customCol: (item: IPurchaseItem) => (
          <Tooltip content="Eliminar item" color="danger">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => onRemoveItem(item.guid)}
              aria-label={`Eliminar ${item.cardName}`}
            >
              <Icon icon="lucide:trash-2" width={16} />
            </Button>
          </Tooltip>
        ),
      });
    }

    return baseCols;
  }, [
    isReadOnly,
    isPrivacyMode,
    displayCurrency,
    handleQuantityChange,
    handleConditionChange,
    onRemoveItem,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <DataTable cols={columns} data={items} isLoading={false} />

      {items.length > 0 && (
        <div className="flex justify-end border-t border-default-200 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-default-500">Total compra:</span>
            <span className="text-lg font-bold text-accent">
              {displayCurrency(total)}
            </span>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-default-400">
          <Icon icon="lucide:package-open" width={40} className="mb-2" />
          <span className="text-sm">No hay items en la compra</span>
        </div>
      )}
    </div>
  );
}
