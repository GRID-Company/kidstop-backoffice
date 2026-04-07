'use client';

import { useMovementSearch } from '../hooks/use-movement-search';
import MovementFilters from '../components/movement-filters';
import MovementHistoryTable from '../components/movement-history-table';

export default function MovementsContent() {
  const {
    setSearch,
    handleFilterChange,
    dateRange,
    handleDateRangeChange,
    resetFilters,
    items,
    hasActiveFilters,
    sortDescriptor,
    setSortDescriptor,
    page,
    setPage,
    totalPages,
    totalCount,
    loading,
  } = useMovementSearch();

  return (
    <>
      <div className="mb-6">
        <MovementFilters
          onSearchChange={setSearch}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
          resultCount={totalCount}
          dateRange={dateRange}
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
      />
    </>
  );
}
