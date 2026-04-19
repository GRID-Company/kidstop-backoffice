import { Controller, FieldValues } from 'react-hook-form';
import { InputProps } from '@heroui/react';
import OverrideInput from '../heorui-overrides/input';
import { ControlWithFormProps } from '@/lib/types/controller.types';

interface InputFormProps<T extends FieldValues> extends Partial<InputProps> {
  controlProps: ControlWithFormProps<T>;
  formatValue?: (value: string) => string;
}

export default function InputForm<T extends FieldValues>({
  controlProps,
  formatValue,
  ...inputProps
}: InputFormProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({ field, fieldState: { invalid } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value = e.target.value;
          if (formatValue) {
            value = formatValue(value);
          }
          field.onChange(value);
        };

        return (
          <OverrideInput
            isInvalid={invalid}
            {...inputProps}
            {...field}
            onChange={handleChange}
          />
        );
      }}
    />
  );
}
