import KidstopButton from '@/shared/base/heorui-overrides/button';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function WindowFormToolbar({ loading }: { loading: boolean }) {
  return (
    <div className='flex items-center justify-between px-6'>
      <div className='flex items-center gap-4 text-white'>
        <Link
          className='text-white opacity-70 hover:opacity-100'
          href='/ventanas'
        >
          Ventanas
        </Link>
        <p>{'>'}</p>
        <p>Nueva ventana</p>
      </div>

      <KidstopButton
        startContent={
          <Icon icon='solar:check-circle-linear' className='text-lg' />
        }
        type='submit'
        isDisabled={loading}
        isLoading={loading}
      >
        Guardar ventana
      </KidstopButton>
    </div>
  );
}
