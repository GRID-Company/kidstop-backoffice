import { useEffect, useState, type PropsWithChildren } from 'react';
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
import { CanalviTable } from '@/shared/base/heorui-overrides/table';
import { ITableColumn } from '@/lib/types/datatable.types';

type DataTableProps = {
  cols: ITableColumn[];
  data: any[];
  isLoading: boolean;
  selectable?: boolean;
  setSelectedKeys?: (selected: any[]) => void;
  selectedKeys?: Set<string>;
} & Partial<TableProps>;

export function DataTable({
  cols,
  data,
  isLoading,
  selectable = false,
  setSelectedKeys,
  selectedKeys,
  ...tableProps
}: PropsWithChildren<DataTableProps>) {
  return (
    <CanalviTable
      {...tableProps}
      aria-label='Tabla'
      className='animate-in fade-in'
      selectedKeys={selectedKeys}
      selectionMode={selectable ? 'multiple' : 'none'}
      onSelectionChange={(e: any) => {
        setSelectedKeys && setSelectedKeys(e);
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
          <TableRow key={item.guid ?? '-'}>
            {cols.map((col: ITableColumn) => (
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
    </CanalviTable>
  );
}
