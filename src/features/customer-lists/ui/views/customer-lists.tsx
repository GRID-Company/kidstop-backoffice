'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import ExportDateRangeModal, {
  ExportDateRange,
} from '@/shared/blocks/export-date-range-modal';
import Search from '@/shared/base/heorui-overrides/search';
import KidstopAutocomplete from '@/shared/base/heorui-overrides/autocomplete';
import { KidstopPagination } from '@/shared/base/heorui-overrides/pagination';
import { ITableColumn } from '@/lib/types/datatable.types';
import { formatFlexibleDate } from '@/lib/utils/format-date';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { ICustomerCardList } from '../../domain/types';
import { TCG_BADGE_LABELS } from '../../domain/constants';
import { useCustomerLists } from '../hooks/use-customer-lists';
import { useExportCardLists } from '../hooks/use-export-card-lists';
import { useListCustomerOptions } from '../hooks/use-list-customer-options';

export default function CustomerLists() {
  const router = useRouter();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const {
    lists,
    totalCount,
    page,
    setPage,
    totalPages,
    filters,
    setSearch,
    setCustomerFilter,
    setDateFrom,
    setDateTo,
    resetFilters,
    hasActiveFilters,
    sortDescriptor,
    setSortDescriptor,
    loading,
    error,
  } = useCustomerLists();
  const {
    handleExportLists,
    handleExportMarketing,
    exportingLists,
    exportingMarketing,
  } = useExportCardLists();
  const {
    isOpen: isExportModalOpen,
    onOpen: onExportModalOpen,
    onClose: onExportModalClose,
  } = useDisclosure();

  const [customerSearch, setCustomerSearch] = useState('');
  const debouncedCustomerSearch = useDebounce(customerSearch, 300);
  const { options: customerOptions } = useListCustomerOptions(
    debouncedCustomerSearch
  );

  useEffect(() => {
    if (error) {
      toast.error('Error al cargar las listas de clientes');
    }
  }, [error]);

  const handleRowClick = useCallback(
    (list: ICustomerCardList) => {
      router.push(`/listas-clientes/${list.guid}`);
    },
    [router]
  );

  const handleCustomerSelection = useCallback(
    (key: React.Key | null) => {
      setCustomerFilter((key as string) || undefined);
    },
    [setCustomerFilter]
  );

  const handleExportFull = useCallback(() => {
    handleExportLists({
      findCustomerCardListsArgs: {
        skip: 0,
        limit: 0,
        sort: { column: 'createdDate', order: 'DESC' },
        search: filters.search?.trim() || undefined,
        filters: {
          tcg: selectedTCG,
          customerGuid: filters.customerGuid || undefined,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
        },
      },
    });
  }, [handleExportLists, filters, selectedTCG]);

  const handleConfirmMarketingExport = useCallback(
    (range: ExportDateRange | undefined) => {
      handleExportMarketing({
        exportCustomerCardListsMarketingArgs: {
          filters: {
            tcg: selectedTCG,
            dateFrom: range?.from,
            dateTo: range?.to,
          },
        },
      });
    },
    [handleExportMarketing, selectedTCG]
  );

  const exportActiveFilters = useMemo(() => {
    const active: string[] = [`TCG: ${TCG_BADGE_LABELS[selectedTCG]}`];
    if (filters.search?.trim()) {
      active.push(`Búsqueda: "${filters.search.trim()}"`);
    }
    return active;
  }, [filters.search, selectedTCG]);

  const exportInitialRange = useMemo(() => {
    if (!filters.dateFrom || !filters.dateTo) return undefined;
    return { start: filters.dateFrom, end: filters.dateTo };
  }, [filters.dateFrom, filters.dateTo]);

  const columns: ITableColumn<ICustomerCardList>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Lista',
        allowSorting: true,
        className: '!text-left min-w-[160px]',
        customCol: (row: ICustomerCardList) => (
          <span className='text-sm font-semibold'>{row.name}</span>
        ),
      },
      {
        key: 'customer',
        label: 'Cliente',
        allowSorting: true,
        className: '!text-left min-w-[180px]',
        customCol: (row: ICustomerCardList) => (
          <div className='flex flex-col items-start'>
            <span className='text-sm font-medium'>
              {row.customer.name || '—'}
            </span>
            <span className='text-default-400 text-xs'>
              {row.customer.emailAddress}
            </span>
          </div>
        ),
      },
      {
        key: 'itemCount',
        label: 'Cartas',
        className: 'w-[90px]',
        customCol: (row: ICustomerCardList) => (
          <Chip size='sm' variant='flat'>
            {row.itemCount}
          </Chip>
        ),
      },
      {
        key: 'createdDate',
        label: 'Creada',
        allowSorting: true,
        className: 'min-w-[120px]',
        customCol: (row: ICustomerCardList) => (
          <span className='text-default-500 text-sm'>
            {formatFlexibleDate(row.createdDate)}
          </span>
        ),
      },
      {
        key: 'actions',
        label: '',
        className: 'w-[60px]',
        customCol: (row: ICustomerCardList) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              isIconOnly
              size='sm'
              variant='light'
              aria-label={`Ver lista ${row.name}`}
              onPress={() => router.push(`/listas-clientes/${row.guid}`)}
            >
              <Icon icon='lucide:eye' width={16} />
            </Button>
          </div>
        ),
      },
    ],
    [router]
  );

  const exporting = exportingLists || exportingMarketing;

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label='Listas de clientes'>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className='bg-accent text-white'
              size='sm'
              isLoading={exporting}
              isDisabled={exporting}
              startContent={
                !exporting && (
                  <Icon icon='solar:download-minimalistic-bold' width={16} />
                )
              }
              endContent={<Icon icon='lucide:chevron-down' width={14} />}
            >
              Exportar
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label='Opciones de exportación'>
            <DropdownItem
              key='lists'
              startContent={<Icon icon='lucide:list' width={16} />}
              onPress={handleExportFull}
            >
              Listado de listas (CSV)
            </DropdownItem>
            <DropdownItem
              key='marketing'
              startContent={<Icon icon='lucide:bar-chart-3' width={16} />}
              onPress={onExportModalOpen}
            >
              Demanda para marketing (CSV)
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-end gap-3'>
            <div className='min-w-[240px] flex-1'>
              <Search
                label='Buscar'
                placeholder='Nombre de lista, cliente o email...'
                value={filters.search || ''}
                onValueChange={setSearch}
                aria-label='Buscar listas'
                isClearable
                onClear={() => setSearch('')}
              />
            </div>

            <KidstopAutocomplete
              label='Cliente'
              placeholder='Todos los clientes'
              items={customerOptions}
              onInputChange={setCustomerSearch}
              onSelectionChange={handleCustomerSelection}
              className='w-[260px]'
              aria-label='Filtrar por cliente'
            />

            <Input
              aria-label='Fecha desde'
              type='date'
              label='Desde'
              size='sm'
              variant='bordered'
              className='w-[160px]'
              onValueChange={(v) => setDateFrom(v || undefined)}
              classNames={{
                inputWrapper: 'border-[1px] bg-white',
                label: 'text-xs',
              }}
            />

            <Input
              aria-label='Fecha hasta'
              type='date'
              label='Hasta'
              size='sm'
              variant='bordered'
              className='w-[160px]'
              onValueChange={(v) => setDateTo(v || undefined)}
              classNames={{
                inputWrapper: 'border-[1px] bg-white',
                label: 'text-xs',
              }}
            />

            {hasActiveFilters && (
              <Button
                size='sm'
                variant='flat'
                onPress={resetFilters}
                startContent={<Icon icon='lucide:x' width={14} />}
              >
                Limpiar
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className='flex items-center gap-2'>
              <span className='text-default-400 text-xs'>
                {totalCount} {totalCount === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>
          )}
        </div>

        <div className='mt-4'>
          <DataTable<ICustomerCardList>
            cols={columns}
            data={lists}
            isLoading={loading}
            rowClickable={true}
            onRowClick={handleRowClick}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          />
        </div>

        {lists.length === 0 && !loading && (
          <div className='text-default-400 flex flex-col items-center justify-center py-12'>
            <Icon icon='lucide:list' width={40} className='mb-2' />
            <span className='text-sm'>
              {hasActiveFilters
                ? 'No se encontraron listas con esos filtros'
                : 'No hay listas registradas'}
            </span>
          </div>
        )}

        {totalPages > 1 && (
          <div className='mt-4 flex justify-center'>
            <KidstopPagination
              total={totalPages}
              page={page}
              onChange={setPage}
              showControls
            />
          </div>
        )}
      </EntitiesPage.CardContainer>

      <ExportDateRangeModal
        isOpen={isExportModalOpen}
        onClose={onExportModalClose}
        onConfirm={handleConfirmMarketingExport}
        title='Exportar demanda de cartas'
        activeFilters={exportActiveFilters}
        initialRange={exportInitialRange}
      />
    </EntitiesPage>
  );
}
