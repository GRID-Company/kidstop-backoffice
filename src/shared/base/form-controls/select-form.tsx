import { Controller, FieldValues } from 'react-hook-form';
import { SelectProps } from '@heroui/react';
import { ControlWithFormProps } from '@/lib/types/controller.types';
import KidstopSelect from '../heorui-overrides/select';

interface SelectFormProps<T extends FieldValues> extends Partial<SelectProps> {
  controlProps: ControlWithFormProps<T>;
}

export default function SelectForm<T extends FieldValues>({
  controlProps,
  ...selectProps
}: SelectFormProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({ field, fieldState: { invalid } }) => (
        <KidstopSelect
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
