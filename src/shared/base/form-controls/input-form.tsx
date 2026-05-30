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
  const isNumberInput = inputProps.type === 'number';
  
  return (
    <Controller
      {...controlProps}
      render={({ field, fieldState: { invalid } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value: string | number = e.target.value;
          
          if (isNumberInput && value !== '') {
            value = e.target.valueAsNumber;
            if (isNaN(value)) {
              value = e.target.value;
            }
          }
          
          if (formatValue && typeof value === 'string') {
            value = formatValue(value);
          }
          
          field.onChange(value);
        };

        return (
          <OverrideInput
            isInvalid={invalid}
            {...inputProps}
            {...field}
            value={field.value ?? ''}
            onChange={handleChange}
          />
        );
      }}
    />
  );
}
