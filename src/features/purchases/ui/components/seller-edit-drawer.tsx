'use client';

import { useCallback, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';

import InputForm from '@/shared/base/form-controls/input-form';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { useSellerForm } from '../../adapters/forms/use-seller-form';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';
import { ISeller } from '../../domain/types';

interface SellerEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SellerFormData) => Promise<void>;
  seller: ISeller | null;
  isLoading?: boolean;
}

export default function SellerEditDrawer({
  isOpen,
  onClose,
  onSubmit,
  seller,
  isLoading = false,
}: SellerEditDrawerProps) {
  const { control, handleSubmit, formState, reset, setValue } = useSellerForm();

  useEffect(() => {
    if (isOpen && seller) {
      setValue('name', seller.name);
      setValue('phone', seller.phone);
      setValue('email', seller.email || '');
      setValue('notes', seller.notes || '');
    }
  }, [isOpen, seller, setValue]);

  const handleFormSubmit: SubmitHandler<SellerFormData> = useCallback(
    async (data) => {
      await onSubmit(data);
      reset();
      onClose();
    },
    [onSubmit, reset, onClose]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            Editar vendedor
          </span>
          <span className="text-sm font-normal text-default-500">
            Actualizar información del vendedor
          </span>
        </DrawerHeader>

        <DrawerBody>
          <form
            id="seller-edit-form"
            onSubmit={(...args) => {
              void handleSubmit(handleFormSubmit)(...args);
            }}
            className="flex flex-col gap-4"
          >
            <InputForm
              label="Nombre"
              placeholder="Nombre del vendedor"
              controlProps={{ control, name: 'name' }}
              isRequired
              aria-label="Nombre del vendedor"
            />

            <InputForm
              label="Celular"
              placeholder="+52 55 1234 5678"
              controlProps={{ control, name: 'phone' }}
              isRequired
              aria-label="Celular del vendedor"
            />

            <InputForm
              label="Email"
              placeholder="correo@ejemplo.com"
              controlProps={{ control, name: 'email' }}
              aria-label="Email del vendedor"
            />

            <Divider />

            <TextareaForm
              label="Notas (opcional)"
              placeholder="Notas sobre el vendedor"
              controlProps={{ control, name: 'notes' }}
              minRows={3}
              maxRows={5}
              aria-label="Notas del vendedor"
            />
          </form>
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={handleClose} className="text-accent">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="seller-edit-form"
            isDisabled={!formState.isValid || isLoading}
            isLoading={isLoading}
            startContent={!isLoading && <Icon icon="lucide:check" />}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {isLoading ? 'Actualizando...' : 'Guardar cambios'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
