'use client';

import { useCallback, useState } from 'react';
import { Button, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Key } from 'react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { IInventoryItem } from '../../domain/types';
import { InventoryAdjustmentFormData } from '../../adapters/forms/inventory-adjustment.form.schema';
import { useInventorySearch } from '../hooks/use-inventory-search';
import InventoryMetrics from '../components/inventory-metrics';
import InventoryFilters from '../components/inventory-filters';
import InventoryGrid from '../components/inventory-grid';
import AdjustmentModal from '../components/adjustment-modal';
import MovementsContent from './movements';

const INVENTORY_TABS = {
  STOCK: 'stock',
  MOVEMENTS: 'movements',
} as const;

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<string>(INVENTORY_TABS.STOCK);

  const {
    setSearch,
    handleFilterChange,
    dateRange,
    handleDateRangeChange,
    resetFilters,
    results,
    paginatedResults,
    hasActiveFilters,
    selectedTCG,
    sortDescriptor,
    setSortDescriptor,
    page,
    setPage,
    totalPages,
  } = useInventorySearch();

  const [selectedItem, setSelectedItem] = useState<IInventoryItem | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

  const handleItemPress = useCallback((item: IInventoryItem) => {
    setSelectedItem(item);
    setIsAdjustmentOpen(true);
  }, []);

  const handleCloseAdjustment = useCallback(() => {
    setIsAdjustmentOpen(false);
    setSelectedItem(null);
  }, []);

  const handleAdjustmentSubmit = useCallback(
    (data: InventoryAdjustmentFormData) => {
      console.info('[mock] Adjustment submitted:', data);
    },
    []
  );

  const handleTabChange = useCallback((key: Key) => {
    setActiveTab(key as string);
  }, []);

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Inventario de Cartas">
          {activeTab === INVENTORY_TABS.STOCK && (
            <Button
              className="text-white"
              style={{ backgroundColor: 'var(--color-accent)' }}
              startContent={<Icon icon="lucide:plus" />}
              onPress={() => setIsAdjustmentOpen(true)}
            >
              Ajuste manual
            </Button>
          )}
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <div className="mb-6">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={handleTabChange}
              variant="underlined"
              classNames={{
                tabList: 'gap-6',
                cursor: 'bg-accent',
                tab: 'px-0 h-10',
                tabContent: 'group-data-[selected=true]:text-accent font-medium',
              }}
            >
              <Tab
                key={INVENTORY_TABS.STOCK}
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:package" />
                    <span>Stock</span>
                  </div>
                }
              />
              <Tab
                key={INVENTORY_TABS.MOVEMENTS}
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:arrow-left-right" />
                    <span>Movimientos</span>
                  </div>
                }
              />
            </Tabs>
          </div>

          {activeTab === INVENTORY_TABS.STOCK && (
            <>
              <div className="mb-6">
                <InventoryMetrics items={results} />
              </div>

              <div className="mb-6">
                <InventoryFilters
                  onSearchChange={setSearch}
                  onFilterChange={handleFilterChange}
                  onDateRangeChange={handleDateRangeChange}
                  onReset={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                  resultCount={results.length}
                  selectedTCG={selectedTCG}
                  dateRange={dateRange}
                />
              </div>

              <InventoryGrid
                items={paginatedResults}
                totalItems={results.length}
                page={page}
                totalPages={totalPages}
                sortDescriptor={sortDescriptor}
                onPageChange={setPage}
                onSortChange={setSortDescriptor}
                onItemPress={handleItemPress}
              />
            </>
          )}

          {activeTab === INVENTORY_TABS.MOVEMENTS && <MovementsContent />}
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <AdjustmentModal
        item={selectedItem}
        isOpen={isAdjustmentOpen}
        onClose={handleCloseAdjustment}
        onSubmit={handleAdjustmentSubmit}
      />
    </>
  );
}
