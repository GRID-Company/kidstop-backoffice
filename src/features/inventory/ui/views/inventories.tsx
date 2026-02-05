import { EntitiesPage } from '@/shared/blocks/entities-page';
import UploadInventoryButton from '../components/upload-inventory-button';
import AddNewButton from '@/shared/base/buttons/add-new-button';
import { InventoryTabs } from '../components/list-tabs';
import { useState } from 'react';
import NewInventory from './new-inventory';
import {
  GetChapesDocument,
  GetGlassesDocument,
  GetProfileVariantsDocument,
} from '@/lib/api/generated/inventory.generated';
import { useQuery } from '@apollo/client/react';
import { usePaginatedDatatable } from '@/lib/utils/use-paginated-datatable';
import { useSelectedBranchStore } from '@/lib/store/selected-branch';
import {
  defaultSort,
  getChapesVars,
  getGlassesVars,
} from '../../domain/inventory-lists.domain';
import { getProfilesVars } from '../../domain/inventory-lists.domain';
import { Tab } from '@heroui/react';
import Perfiles from '../components/lists/profiles-list';
import Herrajes from '../components/lists/chapes-list';
import Varios from '../components/lists/various-list';
import Vidrios from '../components/lists/glasses-list';
import { ChapeInventoryItem, GlassInventoryItem } from '@/lib/api/schema-types';

export default function Inventories() {
  const { selectedBranch } = useSelectedBranchStore();
  const [newInventory, setNewInventory] = useState(false);

  const {
    paginatedArgs: perfilesArgs,
    handleSortChange: onPerfilesSortChange,
    handleSearchChange: onPerfilesSearchChange,
    handleFilterChange: onPerfilesFilterChange,
    tableSort: perfilesTableSort,
  } = usePaginatedDatatable({
    defaultSort,
  });

  const {
    paginatedArgs: chapesArgs,
    handleSortChange: onChapesSortChange,
    handleSearchChange: onChapesSearchChange,
    handleFilterChange: onChapesFilterChange,
    tableSort: chapesTableSort,
  } = usePaginatedDatatable({
    defaultSort,
  });

  const {
    paginatedArgs: glassesArgs,
    handleSortChange: onGlassesSortChange,
    handleSearchChange: onGlassesSearchChange,
    handleFilterChange: onGlassesFilterChange,
    tableSort: glassesTableSort,
  } = usePaginatedDatatable({
    defaultSort,
  });

  const { data: perfiles, loading: perfilesLoading } = useQuery(
    GetProfileVariantsDocument,
    {
      variables: getProfilesVars(perfilesArgs, selectedBranch?.guid || ''),
      skip: selectedBranch === null,
    }
  );

  const { data: chapes, loading: chapesLoading } = useQuery(GetChapesDocument, {
    variables: getChapesVars(chapesArgs, selectedBranch?.guid || ''),
    skip: selectedBranch === null,
  });

  const { data: glasses, loading: glassesLoading } = useQuery(
    GetGlassesDocument,
    {
      variables: getGlassesVars(glassesArgs, selectedBranch?.guid || ''),
      skip: selectedBranch === null,
    }
  );

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label='Inventario'>
          <EntitiesPage.FlexRow>
            <UploadInventoryButton />
            <AddNewButton
              label='Agregar producto'
              onPress={() => setNewInventory(true)}
            />
          </EntitiesPage.FlexRow>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <InventoryTabs>
            <Tab
              key='perfiles'
              title={<InventoryTabs.TabTitle total={0} label='Perfiles' />}
            >
              <Perfiles
                data={perfiles?.getProfileVariants?.data || []}
                loading={perfilesLoading}
                sortDescriptor={perfilesTableSort}
                onSortChange={onPerfilesSortChange}
                onSearchChange={onPerfilesSearchChange}
                onFilterChange={onPerfilesFilterChange}
              />
            </Tab>

            <Tab
              key='herrajes'
              title={<InventoryTabs.TabTitle total={0} label='Herrajes' />}
            >
              <Herrajes
                data={(chapes?.getChapes?.data || []) as ChapeInventoryItem[]}
                loading={chapesLoading}
                sortDescriptor={chapesTableSort}
                onSortChange={onChapesSortChange}
                onSearchChange={onChapesSearchChange}
                onFilterChange={onChapesFilterChange}
              />
            </Tab>

            <Tab
              key='vidrios'
              title={<InventoryTabs.TabTitle total={0} label='Vidrios' />}
            >
              <Vidrios
                data={(glasses?.getGlasses?.data || []) as GlassInventoryItem[]}
                loading={glassesLoading}
                sortDescriptor={glassesTableSort}
                onSortChange={onGlassesSortChange}
                onSearchChange={onGlassesSearchChange}
                onFilterChange={onGlassesFilterChange}
              />
            </Tab>

            <Tab
              key='varios'
              title={<InventoryTabs.TabTitle total={0} label='Varios' />}
            >
              <Varios
                data={[]}
                loading={false}
                sortDescriptor={glassesTableSort}
                onSortChange={() => {}}
                onSearchChange={() => {}}
                onFilterChange={() => {}}
              />
            </Tab>
          </InventoryTabs>
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      {newInventory && <NewInventory onClose={() => setNewInventory(false)} />}
    </>
  );
}
