import { Controller, FieldValues } from 'react-hook-form';
import { SelectProps } from '@heroui/react';
import { ControlWithFormProps } from '@/lib/types/controller.types';
import ColorSelect from './color-select';

interface ColorSelectFormProps<T extends FieldValues>
  extends Partial<SelectProps> {
  controlProps: ControlWithFormProps<T>;
}

export default function ColorSelectForm<T extends FieldValues>({
  controlProps,
  ...selectProps
}: ColorSelectFormProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({ field, fieldState: { invalid } }) => (
        <ColorSelect
          isInvalid={invalid}
          {...selectProps}
          {...field}
          selectedKeys={field.value ? [field.value] : []}
          items={selectProps.items}
        />
      )}
    />
  );
}
