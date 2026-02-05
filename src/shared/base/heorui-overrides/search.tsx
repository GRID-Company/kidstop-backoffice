import { type PropsWithChildren } from 'react';
import { Icon } from '@iconify/react';
import Input from './input';
import { InputProps } from '@heroui/react';

export default function Search({
  children,
  ...inputProps
}: PropsWithChildren<Partial<InputProps>>) {
  return (
    <Input
      type='text'
      endContent={
        <Icon icon='lucide:search' className='text-foreground-600 text-lg' />
      }
      aria-label='input de busqueda'
      defaultValue=''
      {...inputProps}
    >
      {children}
    </Input>
  );
}
