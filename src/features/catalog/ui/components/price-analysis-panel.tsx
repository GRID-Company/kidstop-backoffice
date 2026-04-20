'use client';

import { Tab, Tabs, Checkbox, Input, Button, Tooltip } from '@heroui/react';
import { useMemo, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { IPriceAnalysis } from '../../domain/bulk-lookup.types';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { ITableColumn } from '@/lib/types/datatable.types';
import { CardImage } from '@/shared/components/card-image';

interface PriceAnalysisPanelProps {
  analysis: IPriceAnalysis[];
}

type FilterTab = 'all' | 'profitable' | 'loss' | 'neutral';

export default function PriceAnalysisPanel({ analysis }: PriceAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const { updateItemPrice, selectedItems, toggleItemSelection } = useBulkLookupStore();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredAnalysis = useMemo(() => {
    switch (activeTab) {
      case 'profitable':
        return analysis.filter((a) => a.marginPercentage && a.marginPercentage > 0);
      case 'loss':
        return analysis.filter((a) => a.marginPercentage && a.marginPercentage < 0);
      case 'neutral':
        return analysis.filter((a) => a.marginPercentage === 0 || a.marginPercentage === null);
      default:
        return analysis;
    }
  }, [analysis, activeTab]);

  const stats = useMemo(() => {
    return {
      profitable: analysis.filter((a) => a.marginPercentage && a.marginPercentage > 0).length,
      loss: analysis.filter((a) => a.marginPercentage && a.marginPercentage < 0).length,
      neutral: analysis.filter((a) => a.marginPercentage === 0 || a.marginPercentage === null).length,
    };
  }, [analysis]);

  const getMarginColor = useCallback((margin: number | null) => {
    if (margin === null) return 'default';
    if (margin > 0) return 'success';
    if (margin < 0) return 'danger';
    return 'warning';
  }, []);

  const handlePriceSave = useCallback((cardGuid: string, condition: string) => {
    const newPrice = parseFloat(editValue);
    if (!isNaN(newPrice)) {
      updateItemPrice(cardGuid, condition, newPrice, newPrice);
      setEditingPrice(null);
    }
  }, [editValue, updateItemPrice]);

  const columns: ITableColumn[] = useMemo(() => {
    return [
      {
        key: 'select',
        label: '',
        className: 'w-[50px]',
        customCol: (item: IPriceAnalysis) => (
          <Checkbox
            isSelected={selectedItems.some(
              (s) => s.cardGuid === item.cardGuid && s.condition === item.condition
            )}
            onChange={() => toggleItemSelection(item.cardGuid, item.condition)}
            aria-label={`Select ${item.cardName}`}
          />
        ),
      },
      {
        key: 'card',
        label: 'Carta',
        className: '!text-left min-w-[220px]',
        customCol: (item: IPriceAnalysis) => (
          <div className="flex items-center gap-3">
            <CardImage
              src={undefined}
              alt={item.cardName}
              tcgType={selectedTCG === 'POKEMON' ? 'POKEMON' : 'MAGIC'}
              containerClassName="relative h-12 w-9 rounded overflow-hidden bg-default-100 flex-shrink-0"
              className="object-cover"
              fill
              sizes="36px"
            />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{item.cardName}</span>
              <span className="text-xs text-default-400">{item.condition}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'currentPrice',
        label: 'Actual',
        className: 'w-[120px]',
        customCol: (item: IPriceAnalysis) => (
          <span className="text-sm font-medium">${item.currentPrice?.toFixed(2) || '—'}</span>
        ),
      },
      {
        key: 'marketPrice',
        label: 'Mercado',
        className: 'w-[120px]',
        customCol: (item: IPriceAnalysis) => (
          <span className="text-sm font-medium">${item.marketPrice?.toFixed(2) || '—'}</span>
        ),
      },
      {
        key: 'margin',
        label: 'Margen',
        className: 'w-[100px]',
        customCol: (item: IPriceAnalysis) => (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">${item.margin?.toFixed(2) || '—'}</span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                getMarginColor(item.marginPercentage) === 'success'
                  ? 'bg-success-100 text-success-700'
                  : getMarginColor(item.marginPercentage) === 'danger'
                    ? 'bg-danger-100 text-danger-700'
                    : 'bg-default-100 text-default-700'
              }`}
            >
              {item.marginPercentage !== null ? `${item.marginPercentage.toFixed(1)}%` : 'N/A'}
            </span>
          </div>
        ),
      },
      {
        key: 'quantity',
        label: 'Stock',
        className: 'w-[80px]',
        customCol: (item: IPriceAnalysis) => (
          <span className="text-sm">{item.quantity}</span>
        ),
      },
      {
        key: 'actions',
        label: '',
        className: 'w-[100px]',
        customCol: (item: IPriceAnalysis) => {
          const isEditing = editingPrice === `${item.cardGuid}-${item.condition}`;
          return isEditing ? (
            <div className="flex gap-1">
              <Input
                type="number"
                size="sm"
                value={editValue}
                onValueChange={setEditValue}
                placeholder="Precio"
                className="w-20"
              />
              <Button
                isIconOnly
                size="sm"
                color="success"
                variant="flat"
                onPress={() => handlePriceSave(item.cardGuid, item.condition)}
              >
                <Icon icon="lucide:check" width={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => setEditingPrice(null)}
              >
                <Icon icon="lucide:x" width={16} />
              </Button>
            </div>
          ) : (
            <Tooltip content="Editar precio">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => {
                  setEditingPrice(`${item.cardGuid}-${item.condition}`);
                  setEditValue(item.currentPrice?.toString() || '0');
                }}
              >
                <Icon icon="lucide:edit-2" width={16} />
              </Button>
            </Tooltip>
          );
        },
      },
    ];
  }, [selectedItems, toggleItemSelection, selectedTCG, getMarginColor, editingPrice, editValue, handlePriceSave]);

  if (analysis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-default-400">
        <Icon icon="lucide:package-open" width={40} className="mb-2" />
        <span className="text-sm">No hay análisis de precios disponible</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Análisis de Precios</h3>

        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as FilterTab)}
          variant="underlined"
          color="primary"
          aria-label="Filtrar por margen"
        >
          <Tab key="all" title={`Todas (${analysis.length})`} />
          <Tab key="profitable" title={`Rentables (${stats.profitable})`} />
          <Tab key="loss" title={`Pérdida (${stats.loss})`} />
          <Tab key="neutral" title={`Neutral (${stats.neutral})`} />
        </Tabs>
      </div>

      <DataTable cols={columns} data={filteredAnalysis} isLoading={false} />
    </div>
  );
}
