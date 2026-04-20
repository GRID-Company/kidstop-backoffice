'use client';

import { Card, CardBody, Tab, Tabs } from '@heroui/react';
import { useMemo, useState } from 'react';
import { IPriceAnalysis } from '../../domain/bulk-lookup.types';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';
import BulkLookupItemCard from './bulk-lookup-item-card';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';

interface PriceAnalysisPanelProps {
  analysis: IPriceAnalysis[];
}

type FilterTab = 'all' | 'profitable' | 'loss' | 'neutral';

export default function PriceAnalysisPanel({ analysis }: PriceAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const { updateItemPrice, selectedItems, toggleItemSelection } = useBulkLookupStore();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

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

      <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto">
        {filteredAnalysis.map((item) => (
          <BulkLookupItemCard
            key={`${item.cardGuid}-${item.condition}`}
            item={item}
            tcgType={selectedTCG === 'POKEMON' ? 'POKEMON' : 'MAGIC'}
            isSelected={selectedItems.some(
              (s) => s.cardGuid === item.cardGuid && s.condition === item.condition
            )}
            onToggleSelection={() => toggleItemSelection(item.cardGuid, item.condition)}
            onPriceChange={(sellPrice, purchasePrice) =>
              updateItemPrice(item.cardGuid, item.condition, sellPrice, purchasePrice)
            }
          />
        ))}
      </div>
    </div>
  );
}
