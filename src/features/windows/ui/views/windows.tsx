import AddNewButton from '@/shared/base/buttons/add-new-button';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import WindowGridItem from '../components/grid/window-grid-item';
import Search from '@/shared/base/heorui-overrides/search';
import Select from '@/shared/base/heorui-overrides/select';
import { usePaginatedDatatable } from '@/lib/utils/use-paginated-datatable';
import { useQuery } from '@apollo/client/react';
import { WindowsDocument } from '@/lib/api/generated/windows.generated';
import { WindowTemplate } from '@/lib/api/schema-types';
import Link from 'next/link';
import CanalviCard from '@/shared/base/heorui-overrides/card';
import GridSkeleton from '@/shared/base/skeletons/grid-skeleton';
import {
  MosquitoNetOptions,
  WindowTypeOptions,
} from '../../domain/windows.domain';

const data: { guid: string }[] = [{ guid: '1' }, { guid: '2' }, { guid: '3' }];

export default function WindowsView() {
  const { paginatedArgs, handleSearchChange } = usePaginatedDatatable({
    defaultSort: { column: 'createdDate', order: 'DESC' },
  });

  const { data: res, loading } = useQuery(WindowsDocument, {
    variables: {
      findWindowsArgs: paginatedArgs,
    },
    fetchPolicy: 'cache-and-network',
    // skip: selectedBranch === null,
  });

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label='Ventanas'>
        <EntitiesPage.FlexRow>
          <AddNewButton
            label='Nueva ventana'
            as={Link}
            href='/ventanas/nueva'
          />
        </EntitiesPage.FlexRow>
      </EntitiesPage.Toolbar>

      <EntitiesPage.FlexRow>
        <Search
          label='Búsqueda'
          placeholder='Clave o nombre del producto'
          onValueChange={handleSearchChange}
        />
        <Select
          placeholder='Todos los tipos'
          label='Tipo de ventana'
          items={WindowTypeOptions}
          // onChange={(e) => {
          //   listProps.onFilterChange(
          //     'line',
          //     e.target.value !== '' ? e.target.value : ''
          //   );
          // }}
        />
        <Select
          placeholder='Todas las líneas'
          label='Línea'
          items={[]}
          // onChange={(e) => {
          //   listProps.onFilterChange(
          //     'line',
          //     e.target.value !== '' ? e.target.value : ''
          //   );
          // }}
        />
        <Select
          placeholder='Con y sin mosquitero'
          label='Mosquitero'
          items={MosquitoNetOptions}
          // onChange={(e) => {
          //   listProps.onFilterChange(
          //     'line',
          //     e.target.value !== '' ? e.target.value : ''
          //   );
          // }}
        />
      </EntitiesPage.FlexRow>

      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 xl:gap-8'>
        {res?.windows?.data?.map((window) => (
          <WindowGridItem
            window={window as Partial<WindowTemplate>}
            key={window.guid}
          />
        ))}
      </div>

      {loading && <GridSkeleton />}

      {!loading && res?.windows?.data?.length === 0 && (
        <CanalviCard className='col-span-4 flex h-full items-center justify-center px-12 py-24'>
          <p className='text-center'>No se encontraron resultados</p>
        </CanalviCard>
      )}
    </EntitiesPage>
  );
}
