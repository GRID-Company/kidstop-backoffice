'use client';

import { Card, CardBody, Chip, Input, Tab, Tabs, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { IPriceAnalysis } from '../../domain/bulk-lookup.types';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';

interface PriceAnalysisPanelProps {
  analysis: IPriceAnalysis[];
}

type FilterTab = 'all' | 'profitable' | 'loss' | 'neutral';

export default function PriceAnalysisPanel({ analysis }: PriceAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const { updateItemPrice, selectedItems } = useBulkLookupStore();

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

  if (analysis.length === 0) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center py-8">
          <p className="text-default-500">No hay análisis de precios disponible</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {filteredAnalysis.map((item) => (
            <PriceAnalysisRow
              key={`${item.cardGuid}-${item.condition}`}
              item={item}
              isSelected={selectedItems.some(
                (s) => s.cardGuid === item.cardGuid && s.condition === item.condition
              )}
              onPriceChange={(sellPrice, purchasePrice) =>
                updateItemPrice(item.cardGuid, item.condition, sellPrice, purchasePrice)
              }
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

interface PriceAnalysisRowProps {
  item: IPriceAnalysis;
  isSelected: boolean;
  onPriceChange: (sellPrice: number, purchasePrice: number) => void;
}

function PriceAnalysisRow({ item, isSelected, onPriceChange }: PriceAnalysisRowProps) {
  const [editMode, setEditMode] = useState(false);
  const [sellPrice, setSellPrice] = useState(item.currentPrice?.toString() || '0');

  const getMarginColor = (margin: number | null) => {
    if (margin === null) return 'default';
    if (margin > 0) return 'success';
    if (margin < 0) return 'danger';
    return 'warning';
  };

  const handleSave = () => {
    const newPrice = parseFloat(sellPrice);
    if (!isNaN(newPrice)) {
      onPriceChange(newPrice, newPrice);
      setEditMode(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-default-200 hover:border-default-300 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-medium truncate">{item.cardName}</p>
          <Chip size="sm" variant="flat">
            {item.condition}
          </Chip>
          <Chip size="sm" variant="flat" color={getMarginColor(item.marginPercentage)}>
            {item.marginPercentage !== null ? `${item.marginPercentage.toFixed(1)}%` : 'N/A'}
          </Chip>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-default-500">Actual</p>
            <p className="font-semibold">${item.currentPrice?.toFixed(2) || '—'}</p>
          </div>
          <div>
            <p className="text-default-500">Mercado</p>
            <p className="font-semibold">${item.marketPrice?.toFixed(2) || '—'}</p>
          </div>
          <div>
            <p className="text-default-500">Margen</p>
            <p className="font-semibold">${item.margin?.toFixed(2) || '—'}</p>
          </div>
        </div>
      </div>

      {editMode ? (
        <div className="flex gap-2">
          <Input
            type="number"
            size="sm"
            value={sellPrice}
            onValueChange={setSellPrice}
            placeholder="Nuevo precio"
            className="w-24"
          />
          <Button
            isIconOnly
            size="sm"
            color="success"
            variant="flat"
            onPress={handleSave}
          >
            <Icon icon="lucide:check" width={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => setEditMode(false)}
          >
            <Icon icon="lucide:x" width={16} />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setEditMode(true)}
          >
            <Icon icon="lucide:edit-2" width={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
