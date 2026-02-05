import { BranchOfficesDocument } from '@/lib/api/generated/branches.generated';
import CanalviSelect from '@/shared/base/heorui-overrides/select';
import { useQuery } from '@apollo/client/react';
import { ChangeEvent, memo, useEffect, useMemo } from 'react';
import {
  SelectedBranch,
  useSelectedBranchStore,
} from '@/lib/store/selected-branch';
import { SelectOption } from '@/lib/types/controls.types';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import CanalviButton from '@/shared/base/heorui-overrides/button';
import { Icon } from '@iconify/react';

const toSelectedBranch = (option: SelectOption): SelectedBranch => ({
  guid: option.value,
  name: option.label,
});

const toSelectOption = (branch: SelectedBranch): SelectOption => ({
  value: branch.guid,
  label: branch.name,
});

export default memo(function BranchSelector() {
  const { selectedBranch, setSelectedBranch } = useSelectedBranchStore(
    (state) => state
  );

  const { data: res, loading } = useQuery(BranchOfficesDocument, {
    variables: {
      findBranchOfficesArgs: {
        limit: 0,
        skip: 0,
        sort: {
          column: 'name',
          order: 'ASC',
        },
      },
    },
  });

  const options = useMemo(() => {
    if (!res?.branchOffices?.data) {
      return [...(selectedBranch ? [toSelectOption(selectedBranch)] : [])];
    }
    return [...(res?.branchOffices?.data?.map(toSelectOption) ?? [])];
  }, [selectedBranch, res?.branchOffices?.data]);

  const handleSelectBranch = (value: string) => {
    const branch = options.find((option) => option.value === value);
    if (branch) {
      setSelectedBranch(toSelectedBranch(branch));
    }
  };

  useEffect(() => {
    if (!selectedBranch && options.length > 0 && !loading) {
      setSelectedBranch(toSelectedBranch(options[0]));
    }
  }, [options, selectedBranch, loading]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <CanalviButton
          variant='light'
          endContent={
            <Icon icon='solar:alt-arrow-down-outline' className='text-lg' />
          }
          isLoading={loading}
          className={!selectedBranch?.name ? 'opacity-50' : ''}
        >
          {selectedBranch?.name || 'Selecciona una sucursal'}
        </CanalviButton>
      </DropdownTrigger>

      <DropdownMenu aria-label='Sucursales'>
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onPress={() => handleSelectBranch(option.value)}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});
