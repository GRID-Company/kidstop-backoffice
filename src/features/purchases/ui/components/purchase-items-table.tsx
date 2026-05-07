'use client';

import { useCallback, useMemo, useEffect } from 'react';
import {
  Button,
  Tooltip,
  SelectItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import OverrideInput from '@/shared/base/heorui-overrides/input';
import KidstopSelect from '@/shared/base/heorui-overrides/select';

import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { usePrivacyCurrency } from '@/lib/hooks/use-privacy-currency';
import { formatCurrency } from '@/lib/utils/format-currency';
import { ITableColumn } from '@/lib/types/datatable.types';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { CardImage } from '@/shared/components/card-image';
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
  const displayCurrency = usePrivacyCurrency();
  const { isPrivacyMode } = usePrivacyModeStore();
  const { itemsWithPrices, refetch: refetchPrices } = useItemsReferencePrices(items);

  // Expose refetch to parent when requested
  useEffect(() => {
    if (onRefetchPrices) {
      onRefetchPrices(refetchPrices);
    }
  }, [refetchPrices, onRefetchPrices]);


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
            <CardImage
              src={item.cardImageUrl}
              alt={item.cardName}
              tcgType={item.tcgType}
              containerClassName="relative h-12 w-9 rounded overflow-hidden bg-default-100 flex-shrink-0"
              className="object-cover"
              fill
              sizes="36px"
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
            <KidstopSelect
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
            </KidstopSelect>
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
            <OverrideInput
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
            <OverrideInput
              aria-label="Precio oferta"
              type="number"
              size="sm"
              variant="bordered"
              min={0}
              step={1}
              value={String(item.offerPrice)}
              onValueChange={(val) => handleOfferPriceChange(item.guid, val)}
              startContent={
                <span className="text-xs text-default-400">$</span>
              }
              classNames={{
                inputWrapper: 'border-[1px] bg-white w-[120px] pr-1',
                input: 'text-right pr-6',
              }}
            />
          ),
      },
      {
        key: 'subtotal',
        label: 'Subtotal',
        customCol: (item: IPurchaseItem) => (
          <span className="text-sm font-semibold">
            {formatCurrency(calculateItemSubtotal(item))}
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
              {formatCurrency(total)}
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
