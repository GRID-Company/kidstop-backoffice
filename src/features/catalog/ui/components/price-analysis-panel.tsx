'use client';

import { useCallback, useMemo } from 'react';
import { Button, Tooltip, Select, SelectItem, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { IPriceAnalysis, IBulkLoadItem } from '../../domain/bulk-lookup.types';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { CardImage } from '@/shared/components/card-image';
import { CARD_CONDITION_OPTIONS, CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';
import { CardCondition } from '../../domain/types';

interface PriceAnalysisPanelProps {
  analysis: IPriceAnalysis[];
  selectedItems?: IBulkLoadItem[];
}

const CARD_CONDITIONS = [
  { value: 'Mint', label: 'Mint' },
  { value: 'NearMint', label: 'Near Mint' },
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Light Play', label: 'Light Play' },
  { value: 'Moderate Play', label: 'Moderate Play' },
  { value: 'Heavy Play', label: 'Heavy Play' },
  { value: 'Damaged', label: 'Damaged' },
  { value: 'Ungraded', label: 'Ungraded' },
];

export default function PriceAnalysisPanel({ analysis, selectedItems: selectedItemsProp }: PriceAnalysisPanelProps) {
  const { updateItemPrice, selectedItems: selectedItemsStore, toggleItemSelection } = useBulkLookupStore();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const selectedItems = selectedItemsProp || selectedItemsStore;

  const handleConditionChange = useCallback(
    (cardGuid: string, condition: string, newCondition: string) => {
      updateItemPrice(cardGuid, newCondition, 0, 0);
    },
    [updateItemPrice]
  );

  const handlePriceChange = useCallback(
    (cardGuid: string, condition: string, value: string) => {
      const price = parseFloat(value);
      if (!isNaN(price)) {
        updateItemPrice(cardGuid, condition, price, price);
      }
    },
    [updateItemPrice]
  );

  const columns: ITableColumn[] = useMemo(() => {
    return [
      {
        key: 'card',
        label: 'Carta',
        className: '!text-left min-w-[220px]',
        customCol: (item: IPriceAnalysis) => (
          <div className="flex items-center gap-3">
            <CardImage
              src={item.cardImageUrl}
              alt={item.cardName}
              tcgType={selectedTCG === 'POKEMON' ? 'POKEMON' : 'MAGIC'}
              containerClassName="relative h-12 w-9 rounded overflow-hidden bg-default-100 flex-shrink-0"
              className="object-cover"
              fill
              sizes="36px"
            />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{item.cardName}</span>
              <span className="text-xs text-default-400">Mercado: ${item.marketPrice?.toFixed(2) || '—'}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'condition',
        label: 'Condición',
        className: 'min-w-[160px]',
        customCol: (item: IPriceAnalysis) => (
          <Select
            aria-label="Condición"
            size="sm"
            variant="bordered"
            selectedKeys={new Set([item.condition])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              handleConditionChange(item.cardGuid, item.condition, selected);
            }}
            classNames={{
              trigger: 'border-[1px] bg-white min-w-[140px]',
            }}
          >
            {CARD_CONDITIONS.map((opt) => (
              <SelectItem key={opt.value}>{opt.label}</SelectItem>
            ))}
          </Select>
        ),
      },
      {
        key: 'quantity',
        label: 'Stock',
        className: 'w-[100px]',
        customCol: (item: IPriceAnalysis) => (
          <span className="text-sm">{item.quantity}</span>
        ),
      },
      {
        key: 'sellPrice',
        label: 'Precio Venta',
        customCol: (item: IPriceAnalysis) => (
          <Input
            aria-label="Precio venta"
            type="number"
            size="sm"
            variant="bordered"
            min={0.01}
            step={0.01}
            value={String(item.currentPrice || 0)}
            onValueChange={(val) => handlePriceChange(item.cardGuid, item.condition, val)}
            startContent={<span className="text-xs text-default-400">$</span>}
            classNames={{
              inputWrapper: 'border-[1px] bg-white w-[100px]',
              input: 'text-right',
            }}
          />
        ),
      },
      {
        key: 'margin',
        label: 'Margen',
        className: 'w-[100px]',
        customCol: (item: IPriceAnalysis) => (
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">${item.margin?.toFixed(2) || '—'}</span>
            <span className="text-xs text-default-500">
              {item.marginPercentage !== null ? `${item.marginPercentage.toFixed(1)}%` : 'N/A'}
            </span>
          </div>
        ),
      },
      {
        key: 'actions',
        label: '',
        className: 'w-[60px]',
        customCol: (item: IPriceAnalysis) => (
          <Tooltip content="Seleccionar">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color={
                selectedItems.some((s) => s.cardGuid === item.cardGuid && s.condition === item.condition)
                  ? 'success'
                  : 'default'
              }
              onPress={() => toggleItemSelection(item.cardGuid, item.condition)}
              aria-label={`Select ${item.cardName}`}
            >
              <Icon
                icon={
                  selectedItems.some((s) => s.cardGuid === item.cardGuid && s.condition === item.condition)
                    ? 'lucide:check-circle-2'
                    : 'lucide:circle'
                }
                width={20}
              />
            </Button>
          </Tooltip>
        ),
      },
    ];
  }, [selectedItems, toggleItemSelection, selectedTCG, handleConditionChange, handlePriceChange]);

  if (analysis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-default-400">
        <Icon icon="lucide:package-open" width={40} className="mb-2" />
        <span className="text-sm">No hay análisis de precios disponible</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <DataTable cols={columns} data={analysis} isLoading={false} />
    </div>
  );
}
