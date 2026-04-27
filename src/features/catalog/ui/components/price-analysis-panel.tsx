'use client';

import { useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input, Checkbox } from '@heroui/react';
import { Icon } from '@iconify/react';
import { IPriceAnalysis, IBulkLoadItem } from '../../domain/bulk-lookup.types';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { CardImage } from '@/shared/components/card-image';
import { CARD_CONDITION_OPTIONS, CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';
import { CardCondition } from '../../domain/types';
import CheckboxForm from '@/shared/base/form-controls/checkbox-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import InputForm from '@/shared/base/form-controls/input-form';

interface PriceAnalysisPanelProps {
  analysis: IPriceAnalysis[];
}

interface PriceAnalysisItemWithSelection extends IPriceAnalysis {
  isSelected?: boolean;
}

interface PriceAnalysisFormData {
  items: PriceAnalysisItemWithSelection[];
}

export default function PriceAnalysisPanel({ analysis }: PriceAnalysisPanelProps) {
  const { updateItemPrice, selectedItems, toggleItemSelection } = useBulkLookupStore();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  const { control, watch } = useForm<PriceAnalysisFormData>({
    defaultValues: {
      items: analysis.map((item) => ({
        ...item,
        isSelected: selectedItems.some((s) => s.cardGuid === item.cardGuid && s.condition === item.condition),
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  const columns: ITableColumn[] = useMemo(() => {
    const createColumns = (fieldIndex: number): any[] => [
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
        customCol: (item: PriceAnalysisItemWithSelection, index: number) => {
          const fieldIndex = fields.findIndex((f) => f.id === item.guid);
          if (fieldIndex === -1) return null;
          
          return (
            <SelectForm
              controlProps={{
                name: `items.${fieldIndex}.condition`,
                control,
              }}
              items={CARD_CONDITION_OPTIONS}
              size="sm"
              variant="bordered"
              classNames={{
                trigger: 'border-[1px] bg-white min-w-[140px]',
              }}
              aria-label="Condición"
            />
          );
        },
      },
      {
        key: 'quantity',
        label: 'Stock',
        className: 'w-[100px]',
        customCol: (item: PriceAnalysisItemWithSelection, index: number) => {
          const fieldIndex = fields.findIndex((f) => f.id === item.guid);
          if (fieldIndex === -1) return null;
          
          return (
            <InputForm
              controlProps={{
                name: `items.${fieldIndex}.quantity`,
                control,
              }}
              type="number"
              size="sm"
              variant="bordered"
              min={1}
              classNames={{
                inputWrapper: 'border-[1px] bg-white w-[80px]',
                input: 'text-center',
              }}
              aria-label="Stock"
            />
          );
        },
      },
      {
        key: 'sellPrice',
        label: 'Precio Venta',
        customCol: (item: PriceAnalysisItemWithSelection, index: number) => {
          const fieldIndex = fields.findIndex((f) => f.id === item.guid);
          if (fieldIndex === -1) return null;
          
          return (
            <InputForm
              controlProps={{
                name: `items.${fieldIndex}.currentPrice`,
                control,
              }}
              type="number"
              size="sm"
              variant="bordered"
              min={0.01}
              step={0.01}
              startContent={<span className="text-xs text-default-400">$</span>}
              classNames={{
                inputWrapper: 'border-[1px] bg-white w-[100px]',
                input: 'text-right',
              }}
              aria-label="Precio venta"
            />
          );
        },
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
        key: 'select',
        label: '',
        className: 'w-[50px]',
        customCol: (item: PriceAnalysisItemWithSelection, index: number) => {
          const fieldIndex = fields.findIndex((f) => f.id === item.guid);
          if (fieldIndex === -1) return null;
          
          return (
            <CheckboxForm
              controlProps={{
                name: `items.${fieldIndex}.isSelected`,
                control,
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                toggleItemSelection(item.cardGuid, item.condition);
              }}
            />
          );
        },
      },
    ];
    return createColumns(0);
  }, [selectedItems, toggleItemSelection, selectedTCG, fields]);

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
