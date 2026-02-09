import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Switch,
} from '@heroui/react';
import { Controller, SubmitHandler } from 'react-hook-form';
import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import { useUserForm } from '../../adapters/forms/use-user-form';
import { UserFormData } from '../../adapters/forms/user-form.schema';
import { USER_ROLES, USER_ROLE_LABELS } from '../../domain/constants';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<UserFormData>;
  loading?: boolean;
  defaults?: Partial<UserFormData>;
  title?: string;
  submitLabel?: string;
}

const ROLE_OPTIONS = Object.values(USER_ROLES).map((role) => ({
  value: role,
  label: USER_ROLE_LABELS[role],
}));

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  defaults,
  title = 'Nuevo usuario',
  submitLabel = 'Guardar',
}: UserFormModalProps) {
  const { control, handleSubmit, formState } = useUserForm(defaults);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl">
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
              items={ROLE_OPTIONS}
            />

            <Controller
              control={control}
              name="activated"
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                >
                  {field.value ? 'Activo' : 'Inactivo'}
                </Switch>
              )}
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
