import { type PropsWithChildren } from 'react';
import {
  getKeyValue,
  Spinner,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow,
} from '@heroui/react';
import { KidstopTable } from '@/shared/base/heorui-overrides/table';
import { ITableColumn } from '@/lib/types/datatable.types';

type DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  cols: ITableColumn<T>[];
  data: T[];
  isLoading: boolean;
  selectable?: boolean;
  setSelectedKeys?: (selected: unknown[]) => void;
  selectedKeys?: Set<string>;
  rowClickable?: boolean;
  onRowClick?: (item: T) => void;
} & Partial<TableProps>;

export function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  cols,
  data,
  isLoading,
  selectable = false,
  setSelectedKeys,
  selectedKeys,
  rowClickable = false,
  onRowClick,
  ...tableProps
}: PropsWithChildren<DataTableProps<T>>) {
  return (
    <KidstopTable
      {...tableProps}
      aria-label='Tabla'
      className='animate-in fade-in'
      selectedKeys={selectedKeys}
      selectionMode={selectable ? 'multiple' : 'none'}
      onSelectionChange={(e: unknown) => {
        if (setSelectedKeys) {
          setSelectedKeys(e as unknown[]);
        }
      }}
      checkboxesProps={{
        color: 'secondary',
      }}
    >
      {/* HEADER */}
      <TableHeader columns={cols}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={!!column.allowSorting}
            className={`text-center ${column?.className ?? ''}`}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>

      {/* BODY */}
      <TableBody
        items={data ?? []}
        isLoading={isLoading}
        loadingContent={
          <Spinner
            className='rounded-xl bg-white px-6 py-3 shadow-xl'
            label='Cargando...'
          />
        }
      >
        {(item) => (
          <TableRow 
            key={(item as Record<string, unknown>).guid as string ?? (item as Record<string, unknown>).id as string ?? (item as Record<string, unknown>).key as string}
            className={rowClickable ? 'cursor-pointer hover:bg-[#F5F9FF] transition-colors duration-150' : ''}
            onClick={rowClickable && onRowClick ? () => onRowClick(item) : undefined}
          >
            {cols.map((col: ITableColumn<T>) => (
              <TableCell
                key={col.key}
                className={`text-center ${col?.className ?? ''}`}
              >
                {col.customCol !== undefined
                  ? col.customCol(item)
                  : (getKeyValue(item, col.key) ?? '-')}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </KidstopTable>
  );
}
