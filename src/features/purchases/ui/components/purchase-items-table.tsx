'use client';

import { useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';
import {
  Button,
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
import { useItemsReferencePrices } from '../hooks/use-items-reference-prices';
import { validateOfferPrice, validateQuantity } from '../../adapters/forms/offer-price.form.schema';

const REDACTED_VALUE = '$••••••';

interface PurchaseItemsTableProps {
  items: IPurchaseItem[];
  onUpdateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onRefetchPrices?: (refetch: (items?: IPurchaseItem[]) => void) => void;
  isReadOnly?: boolean;
}

export default function PurchaseItemsTable({
  items,
  onUpdateItem,
  onRemoveItem,
  onRefetchPrices,
  isReadOnly = false,
}: PurchaseItemsTableProps) {
  const { isPrivacyMode } = usePrivacyModeStore();
  const { itemsWithPrices, refetch: refetchPrices } = useItemsReferencePrices(items);

  // Expose refetch to parent when requested
  useEffect(() => {
    if (onRefetchPrices) {
      onRefetchPrices(refetchPrices);
    }
  }, [refetchPrices, onRefetchPrices]);

  const displayCurrency = useCallback(
    (value: number): string =>
      isPrivacyMode ? REDACTED_VALUE : formatCurrency(value),
    [isPrivacyMode]
  );

  const total = useMemo(() => calculateTotal(itemsWithPrices), [itemsWithPrices]);

  const handleQuantityChange = useCallback(
    (itemId: string, value: string) => {
      const { isValid, quantity } = validateQuantity(value);
      if (isValid) {
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

  const handleOfferPriceChange = useCallback(
    (itemId: string, value: string) => {
      const { isValid, price } = validateOfferPrice(value);
      if (isValid) {
        onUpdateItem(itemId, { offerPrice: price });
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
            {item.cardImageUrl ? (
              <img
                src={item.cardImageUrl}
                alt={item.cardName}
                className="h-12 w-9 rounded object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const placeholder = img.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }}
              />
            ) : null}
            {!item.cardImageUrl && (
              <div className="relative h-12 w-9 rounded overflow-hidden bg-default-100">
                <Image
                  src={item.tcgType === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder}
                  alt="Card placeholder"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            )}
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
        key: 'referencePriceAdded',
        label: 'Precio ref. al agregar',
        className: 'w-[140px]',
        customCol: (item: IPurchaseItem) => (
          <span className="text-sm font-medium">
            {displayCurrency(item.referencePrice ?? 0)}
          </span>
        ),
      },
      {
        key: 'referencePriceCurrent',
        label: 'Precio ref. actual',
        className: 'w-[140px]',
        customCol: (item: IPurchaseItem) => (
          <span className="text-sm font-medium">
            {displayCurrency(item.currentReferencePrice ?? 0)}
          </span>
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
        customCol: (item: IPurchaseItem) =>
          isReadOnly ? (
            <span className="text-sm font-medium">
              {displayCurrency(item.offerPrice)}
            </span>
          ) : (
            <Input
              aria-label="Precio oferta"
              type="number"
              size="sm"
              variant="bordered"
              min={0.01}
              step={0.01}
              value={String(item.offerPrice)}
              onValueChange={(val) => handleOfferPriceChange(item.guid, val)}
              startContent={
                <span className="text-xs text-default-400">$</span>
              }
              classNames={{
                inputWrapper: 'border-[1px] bg-white w-[100px]',
                input: 'text-right',
              }}
            />
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
    handleOfferPriceChange,
    onRemoveItem,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <DataTable cols={columns} data={itemsWithPrices} isLoading={false} />

      {itemsWithPrices.length > 0 && (
        <div className="flex justify-end border-t border-default-200 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-default-500">Total compra:</span>
            <span className="text-lg font-bold text-accent">
              {displayCurrency(total)}
            </span>
          </div>
        </div>
      )}

      {itemsWithPrices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-default-400">
          <Icon icon="lucide:package-open" width={40} className="mb-2" />
          <span className="text-sm">No hay items en la compra</span>
        </div>
      )}
    </div>
  );
}
