import CanalviButton from '@/shared/base/heorui-overrides/button';
import { ButtonProps } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function UploadInventoryButton({ ...buttonProps }: ButtonProps) {
  return (
    <CanalviButton
      startContent={<Icon icon='solar:file-send-linear' className='text-lg' />}
      {...buttonProps}
    >
      Cargar inventario
    </CanalviButton>
  );
}
