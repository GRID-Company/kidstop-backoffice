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
    results,
    paginatedResults,
    hasActiveFilters,
    sortDescriptor,
    setSortDescriptor,
    page,
    setPage,
    totalPages,
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
          resultCount={results.length}
          dateRange={dateRange}
        />
      </div>

      <MovementHistoryTable
        items={paginatedResults}
        totalItems={results.length}
        page={page}
        totalPages={totalPages}
        sortDescriptor={sortDescriptor}
        onPageChange={setPage}
        onSortChange={setSortDescriptor}
      />
    </>
  );
}
