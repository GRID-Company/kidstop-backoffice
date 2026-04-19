'use client';

import { useCallback } from 'react';
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
import { formatPhoneNumber } from '@/shared/utils/phone-format';
import { useSellerForm } from '../../adapters/forms/use-seller-form';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';

interface SellerCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SellerFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function SellerCreateDrawer({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: SellerCreateDrawerProps) {
  const { control, handleSubmit, formState, reset } = useSellerForm();

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
            Nuevo vendedor
          </span>
          <span className="text-sm font-normal text-default-500">
            Registrar un nuevo vendedor en el sistema
          </span>
        </DrawerHeader>

        <DrawerBody>
          <form
            id="seller-create-form"
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
              formatValue={formatPhoneNumber}
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
            form="seller-create-form"
            isDisabled={!formState.isValid || isLoading}
            isLoading={isLoading}
            startContent={!isLoading && <Icon icon="lucide:user-plus" />}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {isLoading ? 'Creando...' : 'Crear vendedor'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
