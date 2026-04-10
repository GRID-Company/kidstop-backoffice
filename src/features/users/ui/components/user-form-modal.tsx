import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { useEffect } from 'react';
import { SubmitHandler, useWatch } from 'react-hook-form';

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
  const isEditing = !!defaults;
  const { control, handleSubmit, formState, reset } = useUserForm(defaults, isEditing);
  const selectedRole = useWatch({ control, name: 'role' });
  const isKioskRole = selectedRole === USER_ROLES.CLIENT_KIOSK;

  useEffect(() => {
    if (!isOpen) return;
    reset(defaults ?? { name: '', emailAddress: '', role: USER_ROLES.RECEPTION, password: '' });
  }, [isOpen, defaults, reset]);

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size="xl">
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

            {isKioskRole && (
              <InputForm
                label="Contraseña"
                placeholder="Ingresa la contraseña (mínimo 6 caracteres)"
                controlProps={{ control, name: 'password' }}
                type="password"
              />
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="light"
              onPress={onClose}
              type="button"
              className="text-accent"
            >
              Cancelar
            </Button>
            <Button
              size="lg"
              isLoading={loading}
              type="submit"
              isDisabled={!formState.isValid}
              className="text-white"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {submitLabel}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </KidstopDrawer>
  );
}
