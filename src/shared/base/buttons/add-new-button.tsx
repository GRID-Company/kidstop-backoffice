import KidstopButton from '@/shared/base/heorui-overrides/button';
import { ButtonProps } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function AddNewButton({
  label,
  ...buttonProps
}: Partial<ButtonProps> & { label: string }) {
  return (
    <KidstopButton
      variant='accent'
      startContent={<Icon icon='solar:add-circle-linear' className='text-lg' />}
      {...buttonProps}
    >
      {label}
    </KidstopButton>
  );
}
