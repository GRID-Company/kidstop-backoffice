'use client';

import { useCallback, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';

import InputForm from '@/shared/base/form-controls/input-form';
import { formatPhoneNumber } from '@/shared/utils/phone-format';
import { ICustomer } from '../../domain/types';
import { useCustomerForm } from '../../adapters/forms/use-customer-form';
import { CustomerFormData } from '../../adapters/forms/customer-form.schema';
import { toCustomerFormDefaults } from '../../adapters/mappers/customer.mapper';

interface CustomerEditModalProps {
  customer: ICustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (customerId: string, data: CustomerFormData) => void;
  loading?: boolean;
}

export default function CustomerEditModal({
  customer,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: CustomerEditModalProps) {
  const { control, handleSubmit, formState, reset } = useCustomerForm();

  useEffect(() => {
    if (isOpen && customer) {
      reset(toCustomerFormDefaults(customer));
    }
  }, [isOpen, customer, reset]);

  const handleConfirm: SubmitHandler<CustomerFormData> = useCallback(
    (data) => {
      if (!customer || !onConfirm) return;
      onConfirm(customer.guid, data);
    },
    [customer, onConfirm]
  );

  if (!customer) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            Editar cliente
          </span>
          <span className="text-sm font-normal text-default-500">
            {customer.name}
          </span>
        </DrawerHeader>

        <DrawerBody>
          <form
            id="customer-edit-form"
            onSubmit={(...args) => {
              void handleSubmit(handleConfirm)(...args);
            }}
            className="flex flex-col gap-4"
          >
            <InputForm
              label="Nombre"
              placeholder="Nombre del cliente"
              controlProps={{ control, name: 'name' }}
              isRequired
              aria-label="Nombre del cliente"
            />

            <InputForm
              label="Email"
              placeholder="correo@ejemplo.com"
              controlProps={{ control, name: 'emailAddress' }}
              isRequired
              aria-label="Email del cliente"
            />

            <InputForm
              label="Teléfono"
              placeholder="+52 55 1234 5678"
              controlProps={{ control, name: 'phone' }}
              formatValue={formatPhoneNumber}
              aria-label="Teléfono del cliente"
            />

          </form>
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="customer-edit-form"
            color="primary"
            isLoading={loading}
            isDisabled={!formState.isValid}
            startContent={<Icon icon="lucide:save" />}
          >
            Guardar cambios
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
