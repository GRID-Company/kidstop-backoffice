import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@heroui/react';
import { useCallback, useState } from 'react';
import {
  InventoryStep,
  InventoryType,
} from '../../domain/inventory-create.domain';
import TypeSelector from '../components/create-update/type-selector';
import ProfileFormBody from '../components/create-update/profile-form-body';
import ChapeFormBody from '../components/create-update/chape-form-body';
import GlassFormBody from '../components/create-update/glass-form-body';
import VariousFormBody from '../components/create-update/various-form-body';
import { SubmitHandler } from 'react-hook-form';
import useInventoryForm from '../../adapters/forms/use-inventory-form';
import useInventoryMutation from '../../adapters/api/use-inventory-mutation';
import { ChapeForm } from '../../adapters/forms/chape.form.schema';
import { GlassForm } from '../../adapters/forms/glass.form.schema';
import { ProfileForm } from '../../adapters/forms/profile.form.schema';
import { toInventoryPayload } from '../../adapters/mappers/inventory-form.mapper';
import toast from 'react-hot-toast';

interface NewInventoryProps {
  onClose: () => void;
}

export default function NewInventory({ onClose }: NewInventoryProps) {
  const [step, setStep] = useState<InventoryStep>(null);
  const [type, setType] = useState<InventoryType>('perfil');
  const { control, handleSubmit, formState } = useInventoryForm(type);
  const [mutate, { loading }] = useInventoryMutation(type);

  const handleNext = useCallback(() => {
    if (step === null) {
      setStep(type);
    }
  }, [setType, setStep, type]);

  const onInventoryCreate: SubmitHandler<
    ProfileForm | ChapeForm | GlassForm
  > = async (data): Promise<void> => {
    try {
      const payload = toInventoryPayload(
        data,
        type,
        true,
        ''
      );
      await mutate({
        variables: payload,
      });
      toast.success('Producto creado exitosamente');
      onClose();
    } catch (error) {
      toast.error('Error al crear el producto');
    }
  };

  const isTypeSelector = step === null;

  return (
    <Drawer isOpen={true} onClose={onClose} size='xl'>
      <form
        onSubmit={(...args) => {
          void handleSubmit(onInventoryCreate)(...args);
        }}
      >
        <DrawerContent>
          <DrawerHeader className='flex flex-col gap-1'>
            Nuevo producto
          </DrawerHeader>

          <DrawerBody>
            {isTypeSelector && <TypeSelector type={type} setType={setType} />}
            {step === 'perfil' && <ProfileFormBody control={control} />}
            {step === 'herraje' && <ChapeFormBody control={control} />}
            {step === 'vidrio' && <GlassFormBody control={control} />}
            {step === 'varios' && <VariousFormBody control={control} />}
          </DrawerBody>

          <DrawerFooter className='justify-between'>
            <div>
              {!isTypeSelector && (
                <Button
                  color='primary'
                  variant='light'
                  onPress={() => setStep(null)}
                  size='lg'
                  type='button'
                >
                  Atrás
                </Button>
              )}
            </div>

            {isTypeSelector ? (
              <Button
                color='primary'
                size='lg'
                className='min-w-[140px]'
                onPress={handleNext}
                type='button'
              >
                Siguiente
              </Button>
            ) : (
              <Button
                color='primary'
                size='lg'
                isLoading={loading}
                type='submit'
                isDisabled={!formState.isValid}
              >
                Agregar producto
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
