import { usePaginatedDatatable } from '@/lib/utils/use-paginated-datatable';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { SortDescriptor } from '@heroui/react';
import { memo, useRef } from 'react';
import { ITableColumn } from '@/lib/types/datatable.types';
import Search from '@/shared/base/heorui-overrides/search';
import { InventoryListProps } from '@/features/inventory/domain/inventory-lists.domain';

interface Props {
  data: any[];
  loading: boolean;
}

const COLS: ITableColumn[] = [
  {
    key: 'key',
    label: 'Clave',
  },
  {
    key: 'product',
    label: 'Producto',
  },
  {
    key: 'quantity',
    label: 'Cantidad',
  },
  {
    key: 'unitprice',
    label: 'Precio Unitario',
  },
  {
    key: 'actions',
    label: '',
  },
];

export default memo(function VariosList({
  data = [],
  loading = false,
  ...listProps
}: InventoryListProps<Partial<any>>) {
  const skipRef = useRef<HTMLDivElement>(null);

  const { tableSort, handleSortChange } = usePaginatedDatatable({
    defaultSort: { column: 'clave', order: 'ASC' },
  });

  return (
    <>
      <div className='mb-4 flex items-center gap-4'>
        <Search label='Búsqueda' placeholder='Clave o nombre del producto' />
      </div>
      <DataTable
        cols={COLS}
        data={data}
        isLoading={loading}
        sortDescriptor={tableSort}
        onSortChange={(e: SortDescriptor) => {
          handleSortChange(e);
        }}
      />
      <p className='my-[80px] w-full text-center'>
        No se encontraron resultados
      </p>
      <div ref={skipRef} />
    </>
  );
});
