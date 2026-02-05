import { useMutation } from '@apollo/client/react';
import {
  CreateWindowDocument,
  WindowsDocument,
} from '@/lib/api/generated/windows.generated';
import { useWindowForm } from '../../adapters/forms/use-window-form';
import { WindowFormProvider } from '../components/create-update/window-form.context';
import toast from 'react-hot-toast';
import { toWindowPayload } from '../../adapters/mappers/window-form.mapper';
import { MutationCreateWindowArgs } from '@/lib/api/schema-types';
import { SubmitHandler } from 'react-hook-form';
import { WindowForm } from '../../adapters/forms/window.form.schema';
import WindowFormToolbar from '../components/create-update/window-form-toolbar';
import WindowInformation from '../components/create-update/window-information';
import WindowImages from '../components/create-update/window-images';
import WindowChapes from '../components/create-update/window-chapes';
import WindowGlasses from '../components/create-update/window-glasses';
import WindowProfilesHorizontal from '../components/create-update/window-profiles-horizontal';
import WindowProfilesVertical from '../components/create-update/window-profiles-vertical';
import { useRouter } from 'next/navigation';

export default function NewWindowView() {
  const router = useRouter();
  const { control, handleSubmit, setValue } = useWindowForm();
  const [mutate, { loading }] = useMutation(CreateWindowDocument, {
    refetchQueries: [WindowsDocument],
  });

  const onWindowCreate: SubmitHandler<WindowForm> = async (
    data
  ): Promise<void> => {
    try {
      const payload = toWindowPayload(data);
      await mutate({
        variables: payload as unknown as MutationCreateWindowArgs,
      });
      router.push('/ventanas');
      toast.success('Producto creado exitosamente');
    } catch (error) {
      toast.error('Error al crear el producto');
    }
  };

  return (
    <WindowFormProvider value={{ control: control }}>
      <form
        onSubmit={(...args) => {
          void handleSubmit(onWindowCreate)(...args);
        }}
      >
        <WindowFormToolbar loading={loading} />

        <div className='mt-6 flex gap-4'>
          <div className='flex w-1/3 max-w-[400px] flex-col gap-4'>
            <WindowInformation />
            <WindowImages setValue={setValue} />
          </div>

          <div className='flex w-2/3 grow flex-col gap-6'>
            <WindowProfilesVertical />
            <WindowProfilesHorizontal />
            <WindowChapes />
            <WindowGlasses />
          </div>
        </div>
      </form>
    </WindowFormProvider>
  );
}
