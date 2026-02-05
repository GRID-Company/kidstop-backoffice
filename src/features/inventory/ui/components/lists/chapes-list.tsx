import { DataTable } from '@/shared/blocks/data-table/data-table';
import { Button, SortDescriptor } from '@heroui/react';
import { memo, useRef } from 'react';
import { ITableColumn } from '@/lib/types/datatable.types';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import { ChapeInventoryItem } from '@/lib/api/schema-types';
import { InventoryListProps } from '@/features/inventory/domain/inventory-lists.domain';
import { Icon } from '@iconify/react';
import { ColorKey } from '@/lib/types/inventory.types';
import ColorPresenter from '@/shared/blocks/color-selector/color-presenter';
import ColorSelect from '@/shared/blocks/color-selector/color-select';

const COLS: ITableColumn[] = [
  {
    key: 'sku',
    label: 'Clave',
  },
  {
    key: 'line',
    label: 'Linea',
  },
  {
    key: 'name',
    label: 'Producto',
  },
  {
    key: 'color',
    label: 'Color',
    className: 'w-[180px] text-left justify-start',
    customCol: (row: ChapeInventoryItem) => (
      <ColorPresenter color={row?.color as ColorKey} />
    ),
  },
  {
    key: 'supplier',
    label: 'Proveedor',
  },
  {
    key: 'stock[0].stock',
    label: 'Cantidad',
    customCol: (row: ChapeInventoryItem) => row?.stock?.[0]?.stock || '0',
  },
  {
    key: 'unitMeasure',
    label: 'Unidad',
  },
  {
    key: 'price',
    label: 'Precio Unitario',
    customCol: (row: ChapeInventoryItem) =>
      row?.price?.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }) || '0',
  },
  {
    key: 'actions',
    label: '',
    customCol: (row: ChapeInventoryItem) => (
      <Button variant='light' size='lg' isIconOnly>
        <Icon icon='lucide:more-horizontal' />
      </Button>
    ),
    className: 'w-12',
  },
];

export default memo(function HerrajesList({
  data = [],
  loading = false,
  ...listProps
}: InventoryListProps<Partial<ChapeInventoryItem>>) {
  const skipRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className='mb-4 flex items-center gap-4'>
        <Search
          label='Búsqueda'
          placeholder='Clave o nombre del producto'
          onValueChange={listProps.onSearchChange}
        />
        <Select
          placeholder='Todas las líneas'
          label='Línea'
          items={[]}
          onChange={(e) => {
            listProps.onFilterChange(
              'line',
              e.target.value !== '' ? e.target.value : ''
            );
          }}
        />
        <Select
          placeholder='Todos los colores'
          label='Color'
          items={[]}
          onChange={(e) => {
            listProps.onFilterChange(
              'color',
              e.target.value !== '' ? e.target.value : ''
            );
          }}
        />
        <ColorSelect
          placeholder='Todos los proveedores'
          label='Proveedor'
          onChange={(e) => {
            listProps.onFilterChange(
              'supplier',
              e.target.value !== '' ? e.target.value : ''
            );
          }}
        />
      </div>

      <DataTable
        cols={COLS}
        data={data}
        isLoading={loading}
        sortDescriptor={listProps.sortDescriptor}
        onSortChange={(e: SortDescriptor) => {
          listProps.onSortChange(e);
        }}
      />

      <div ref={skipRef} />
    </>
  );
});
