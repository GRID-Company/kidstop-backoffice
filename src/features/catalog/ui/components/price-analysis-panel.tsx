'use client';

import { useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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

interface PriceAnalysisFormData {
  items: IPriceAnalysis[];
}

export default function PriceAnalysisPanel({ analysis }: PriceAnalysisPanelProps) {
  const { updateItemPrice, selectedItems, toggleItemSelection } = useBulkLookupStore();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  const { control, watch } = useForm<PriceAnalysisFormData>({
    defaultValues: {
      items: analysis,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  const handleConditionChange = useCallback(
    (index: number, newCondition: string) => {
      const item = watchedItems[index];
      if (item) {
        updateItemPrice(item.cardGuid, newCondition, item.currentPrice || 0, item.currentPrice || 0);
      }
    },
    [watchedItems, updateItemPrice]
  );

  const handlePriceChange = useCallback(
    (index: number, value: string) => {
      const item = watchedItems[index];
      if (item) {
        const price = parseFloat(value);
        if (!isNaN(price)) {
          updateItemPrice(item.cardGuid, item.condition, price, price);
        }
      }
    },
    [watchedItems, updateItemPrice]
  );

  const handleStockChange = useCallback(
    (index: number, value: string) => {
      const stock = parseInt(value);
      if (!isNaN(stock) && stock > 0) {
        console.log('Stock change at index:', index, 'value:', stock);
      }
    },
    []
  );

  const columns: ITableColumn[] = useMemo(() => {
    const createColumns = (fieldIndex: number) => [
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
              <span className="text-xs text-default-400">Ref: ${item.marketPrice?.toFixed(2) || '—'}</span>
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
              handleConditionChange(fields.findIndex((f) => f.id === item.guid), selected);
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
          <Input
            aria-label="Stock"
            type="number"
            size="sm"
            variant="bordered"
            min={1}
            value={String(item.quantity)}
            onValueChange={(val) => handleStockChange(fields.findIndex((f) => f.id === item.guid), val)}
            classNames={{
              inputWrapper: 'border-[1px] bg-white w-[80px]',
              input: 'text-center',
            }}
          />
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
            onValueChange={(val) => handlePriceChange(fields.findIndex((f) => f.id === item.guid), val)}
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
        customCol: (item: IPriceAnalysis) => {
          const isSelected = selectedItems.some((s) => s.cardGuid === item.cardGuid && s.condition === item.condition);
          return (
            <Tooltip content={isSelected ? 'Deseleccionar' : 'Seleccionar'}>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className={isSelected ? 'bg-success-100' : 'bg-default-100'}
                onPress={() => toggleItemSelection(item.cardGuid, item.condition)}
                aria-label={`Select ${item.cardName}`}
              >
                <Icon
                  icon={isSelected ? 'lucide:check-circle-2' : 'lucide:circle'}
                  width={20}
                  className={isSelected ? 'text-success-600' : 'text-default-400'}
                />
              </Button>
            </Tooltip>
          );
        },
      },
    ];
    return createColumns(0);
  }, [selectedItems, toggleItemSelection, selectedTCG, handleConditionChange, handlePriceChange, handleStockChange, fields]);

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
      <DataTable cols={columns} data={watchedItems} isLoading={false} />
    </div>
  );
}
