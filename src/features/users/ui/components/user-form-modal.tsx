import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@heroui/react';
import { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';

import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import { useUserForm } from '../../adapters/forms/use-user-form';
import { UserFormData } from '../../adapters/forms/user-form.schema';
import { USER_ROLE_OPTIONS, USER_ROLES } from '../../domain/constants';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<UserFormData>;
  loading?: boolean;
  defaults?: Partial<UserFormData>;
  title?: string;
  submitLabel?: string;
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  defaults,
  title = 'Nuevo usuario',
  submitLabel = 'Guardar',
}: UserFormModalProps) {
  const { control, handleSubmit, formState, reset } = useUserForm(defaults);

  useEffect(() => {
    if (!isOpen) return;
    reset(defaults ?? { name: '', emailAddress: '', role: USER_ROLES.RECEPTION });
  }, [isOpen, defaults, reset]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl" classNames={{ base: 'bg-white', header: 'border-b border-gray-100 text-content-primary font-semibold', body: 'bg-neutral-subtle/30', footer: 'border-t border-gray-100 bg-white' }}>
      <form
        onSubmit={(...args) => {
          void handleSubmit(onSubmit)(...args);
        }}
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">{title}</DrawerHeader>

          <DrawerBody className="flex flex-col gap-4">
            <InputForm
              label="Nombre"
              placeholder="Ingresa el nombre del usuario"
              controlProps={{ control, name: 'name' }}
            />

            <InputForm
              label="Correo electrónico"
              placeholder="Ingresa el correo electrónico"
              controlProps={{ control, name: 'emailAddress' }}
            />

            <SelectForm
              label="Rol"
              placeholder="Selecciona un rol"
              controlProps={{ control, name: 'role' }}
              items={USER_ROLE_OPTIONS}
            />
          </DrawerBody>

          <DrawerFooter>
            <Button
              color="primary"
              variant="light"
              onPress={onClose}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              size="lg"
              isLoading={loading}
              type="submit"
              isDisabled={!formState.isValid}
            >
              {submitLabel}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
