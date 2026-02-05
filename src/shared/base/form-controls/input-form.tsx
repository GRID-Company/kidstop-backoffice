import { Controller, FieldValues } from 'react-hook-form';
import { InputProps } from '@heroui/react';
import OverrideInput from '../heorui-overrides/input';
import { ControlWithFormProps } from '@/lib/types/controller.types';

interface InputFormProps<T extends FieldValues> extends Partial<InputProps> {
  controlProps: ControlWithFormProps<T>;
}

export default function InputForm<T extends FieldValues>({
  controlProps,
  ...inputProps
}: InputFormProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({ field, fieldState: { invalid } }) => (
        <OverrideInput isInvalid={invalid} {...inputProps} {...field} />
      )}
    />
  );
}
