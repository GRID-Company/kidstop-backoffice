import { DataTable } from '@/shared/blocks/data-table/data-table';
import { Button, SortDescriptor } from '@heroui/react';
import { memo, useRef } from 'react';
import { ITableColumn } from '@/lib/types/datatable.types';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import { InventoryListProps } from '@/features/inventory/domain/inventory-lists.domain';
import {
  ProfileInventoryGroup,
  ProfileInventoryItemVariant,
} from '@/lib/api/schema-types';
import { Icon } from '@iconify/react';
import { ColorKey } from '@/lib/types/inventory.types';
import ColorPresenter from '@/shared/blocks/color-selector/color-presenter';
import ColorSelect from '@/shared/blocks/color-selector/color-select';

const COLS: ITableColumn[] = [
  {
    key: 'profileGroup.sku',
    label: 'Clave',
    customCol: (row: ProfileInventoryItemVariant) =>
      row?.profileGroup?.sku || '-',
  },
  {
    key: 'profileGroup.line',
    label: 'Linea',
    customCol: (row: ProfileInventoryItemVariant) =>
      row?.profileGroup?.line || '-',
  },
  {
    key: 'profileGroup.name',
    label: 'Producto',
    customCol: (row: ProfileInventoryItemVariant) =>
      row?.profileGroup?.name || '-',
  },
  {
    key: 'profileGroup.color',
    label: 'Color',
    className: 'w-[180px] text-left justify-start',

    customCol: (row: ProfileInventoryItemVariant) => (
      <ColorPresenter color={row?.profileGroup?.color as ColorKey} />
    ),
  },
  {
    key: 'size',
    label: 'Medida',
  },
  {
    key: 'stock[0].stock',
    label: 'Cantidad',
    customCol: (row: ProfileInventoryItemVariant) =>
      row?.stock?.[0]?.stock || '0',
  },
  {
    key: 'profileGroup.price',
    label: 'Precio Unitario',
    customCol: (row: ProfileInventoryItemVariant) =>
      row?.profileGroup?.price?.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }) || '0',
  },
  {
    key: 'actions',
    label: '',
    customCol: (row: ProfileInventoryItemVariant) => (
      <Button variant='light' size='lg' isIconOnly>
        <Icon icon='lucide:more-horizontal' />
      </Button>
    ),
    className: 'w-12',
  },
];

export default memo(function PerfilesList({
  data = [],
  loading = false,
  ...listProps
}: InventoryListProps<Partial<ProfileInventoryGroup>>) {
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
        <ColorSelect
          placeholder='Todos los colores'
          label='Color'
          onChange={(e) => {
            listProps.onFilterChange(
              'color',
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
