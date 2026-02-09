'use client';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useInventorySearch } from '../hooks/use-inventory-search';
import InventoryFilters from '../components/inventory-filters';
import InventoryGrid from '../components/inventory-grid';

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

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="Inventario de Cartas">
        <></>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
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
        />
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
