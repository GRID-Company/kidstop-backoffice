'use client';

import { useCallback, useMemo, useState } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Control, FieldValues, Path } from 'react-hook-form';

import FormAutocomplete from '@/shared/base/form-controls/form-autocomplete';
import { ISelectOption } from '@/shared/base/heorui-overrides/select';
import { ISeller } from '../../domain/types';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';
import { useSellers } from '../hooks/use-sellers';
import SellerCreateDrawer from './seller-create-drawer';

interface SellerSelectorProps<T extends FieldValues> {
  controlProps: {
    control: Control<T>;
    name: Path<T>;
  };
  onSellerCreated?: (seller: ISeller) => void;
}

export default function SellerSelector<T extends FieldValues>({
  controlProps,
  onSellerCreated,
}: SellerSelectorProps<T>) {
  const [search, setSearch] = useState<string | undefined>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { sellers, createSeller, getSellerById, creating } = useSellers(search);

  const sellerOptions: ISelectOption[] = useMemo(
    () =>
      sellers.map((seller) => ({
        value: seller.guid,
        label: `${seller.name} · ${seller.phone}`,
      })),
    [sellers]
  );

  const handleCreateSeller = useCallback(
    async (data: SellerFormData) => {
      const newSeller = await createSeller(data);
      if (newSeller) {
        onSellerCreated?.(newSeller);
      }
    },
    [createSeller, onSellerCreated]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <FormAutocomplete
            items={sellerOptions}
            controlProps={controlProps}
            label="Vendedor"
            placeholder="Buscar vendedor por nombre o teléfono..."
            isRequired
            aria-label="Selector de vendedor"
            onInputChange={setSearch}
            onSelectIcon={
              <Icon
                icon="lucide:user-check"
                className="-mr-[1px] h-5 text-xl text-accent"
              />
            }
          />
        </div>
        <Button
          variant="flat"
          onPress={() => setIsDrawerOpen(true)}
          startContent={<Icon icon="lucide:user-plus" />}
          className="shrink-0 text-accent"
          aria-label="Crear nuevo vendedor"
        >
          Nuevo
        </Button>
      </div>

      <SellerCreateDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateSeller}
        isLoading={creating}
      />
    </div>
  );
}
