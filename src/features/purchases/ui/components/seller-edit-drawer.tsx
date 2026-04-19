'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@heroui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ISeller } from '../../domain/types';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';
import InputForm from '@/shared/base/form-controls/input-form';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { useSellerForm } from '../../adapters/forms/use-seller-form';

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
  const { control, handleSubmit, reset } = useSellerForm();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit: SubmitHandler<SellerFormData> = async (data) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="sm">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Editar vendedor</span>
        </DrawerHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <DrawerBody className="flex flex-col gap-4">
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
              aria-label="Celular del vendedor"
            />
            <InputForm
              label="Email"
              placeholder="correo@ejemplo.com"
              controlProps={{ control, name: 'email' }}
              type="email"
              aria-label="Email del vendedor"
            />
            <TextareaForm
              label="Notas"
              placeholder="Información adicional sobre el vendedor"
              controlProps={{ control, name: 'notes' }}
              aria-label="Notas del vendedor"
            />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="light" onPress={handleClose} isDisabled={isLoading}>
              Cancelar
            </Button>
            <Button
              className="bg-accent text-white"
              type="submit"
              isLoading={isLoading}
            >
              Guardar cambios
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
