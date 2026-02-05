import CanalviButton from '@/shared/base/heorui-overrides/button';
import { ButtonProps } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function AddNewButton({
  label,
  ...buttonProps
}: Partial<ButtonProps> & { label: string }) {
  return (
    <CanalviButton
      startContent={<Icon icon='solar:add-circle-linear' className='text-lg' />}
      {...buttonProps}
    >
      {label}
    </CanalviButton>
  );
}
