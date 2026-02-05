import { DataTable } from '@/shared/blocks/data-table/data-table';
import { Button, SortDescriptor } from '@heroui/react';
import { memo, useRef } from 'react';
import { ITableColumn } from '@/lib/types/datatable.types';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import { InventoryListProps } from '@/features/inventory/domain/inventory-lists.domain';
import { GlassInventoryItem } from '@/lib/api/schema-types';
import { Icon } from '@iconify/react';

const COLS: ITableColumn[] = [
  {
    key: 'sku',
    label: 'Clave',
  },
  {
    key: 'name',
    label: 'Producto',
  },
  {
    key: 'thickness',
    label: 'Grosor',
  },
  // {
  //   key: 'measure',
  //   label: 'Medida',
  // },
  {
    key: 'stock[0].stock',
    label: 'Cantidad',
    customCol: (row: GlassInventoryItem) => row?.stock?.[0]?.stock || '0',
  },
  {
    key: 'unitprice',
    label: 'Precio Unitario',
    customCol: (row: GlassInventoryItem) =>
      row?.price?.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }) || '0',
  },
  {
    key: 'actions',
    label: '',
    customCol: (row: GlassInventoryItem) => (
      <Button variant='light' size='lg' isIconOnly>
        <Icon icon='lucide:more-horizontal' />
      </Button>
    ),
    className: 'w-12',
  },
];

export default memo(function VidriosList({
  data = [],
  loading = false,
  ...listProps
}: InventoryListProps<GlassInventoryItem>) {
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
          placeholder='Todas los grosores'
          label='Grosor'
          items={[]}
          onChange={(e) => {
            listProps.onFilterChange(
              'depth',
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
