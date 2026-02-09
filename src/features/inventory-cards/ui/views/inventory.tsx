'use client';

import { useCallback, useState } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { IInventoryItem } from '../../domain/types';
import { InventoryAdjustmentFormData } from '../../adapters/forms/inventory-adjustment.form.schema';
import { useInventorySearch } from '../hooks/use-inventory-search';
import InventoryMetrics from '../components/inventory-metrics';
import InventoryFilters from '../components/inventory-filters';
import InventoryGrid from '../components/inventory-grid';
import AdjustmentModal from '../components/adjustment-modal';

export default function Inventory() {
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

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Inventario de Cartas">
          <Button
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
            startContent={<Icon icon="lucide:plus" />}
            onPress={() => setIsAdjustmentOpen(true)}
          >
            Ajuste manual
          </Button>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
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
