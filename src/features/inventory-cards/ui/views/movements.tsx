'use client';

import { useCallback, useState } from 'react';

import { useMovementSearch } from '../hooks/use-movement-search';
import MovementFilters from '../components/movement-filters';
import MovementHistoryTable from '../components/movement-history-table';
import MovementDetailDrawer from '../components/movement-detail-drawer';
import { IInventoryMovement } from '../../domain/types';

export default function MovementsContent() {
  const [selectedMovement, setSelectedMovement] =
    useState<IInventoryMovement | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    setSearch,
    handleFilterChange,
    dateRange,
    handleDateRangeChange,
    resetFilters,
    resetKey,
    filters,
    activeFilterCount,
    items,
    hasActiveFilters,
    selectedTCG,
    sortDescriptor,
    setSortDescriptor,
    page,
    setPage,
    totalPages,
    totalCount,
    loading,
  } = useMovementSearch();

  const handleMovementPress = useCallback((item: IInventoryMovement) => {
    setSelectedMovement(item);
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <>
      <div className='mb-6'>
        <MovementFilters
          onSearchChange={setSearch}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          resultCount={totalCount}
          selectedTCG={selectedTCG}
          dateRange={dateRange}
          filters={filters}
          resetKey={resetKey}
        />
      </div>

      <MovementHistoryTable
        items={items}
        totalItems={totalCount}
        isLoading={loading}
        page={page}
        totalPages={totalPages}
        sortDescriptor={sortDescriptor}
        onPageChange={setPage}
        onSortChange={setSortDescriptor}
        onMovementPress={handleMovementPress}
      />

      <MovementDetailDrawer
        item={selectedMovement}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </>
  );
}
