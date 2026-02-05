import CanalviButton from '@/shared/base/heorui-overrides/button';
import { Button, ButtonProps } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function CloseButton({ ...buttonProps }: Partial<ButtonProps>) {
  const { className, ...rest } = buttonProps;
  return (
    <Button
      color='danger'
      isIconOnly
      radius='full'
      size='sm'
      className={`size-6 min-w-6 ${className}`}
      {...rest}
    >
      <Icon
        icon='material-symbols:close-rounded'
        className='text-base text-white'
      />
    </Button>
  );
}
