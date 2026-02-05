import { Controller, FieldValues } from 'react-hook-form';
import { RadioGroup, RadioGroupProps } from '@heroui/react';
import { ControlWithFormProps } from '@/lib/types/controller.types';

interface RadioFormProps<T extends FieldValues>
  extends Partial<RadioGroupProps> {
  controlProps: ControlWithFormProps<T>;
}

export default function RadioForm<T extends FieldValues>({
  controlProps,
  ...radioGroupProps
}: RadioFormProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({
        field: { value, onChange, ...restField },
        fieldState: { invalid },
      }) => (
        <RadioGroup
          {...radioGroupProps}
          value={value}
          onValueChange={onChange}
          {...restField}
          isInvalid={invalid}
        >
          {radioGroupProps.children}
        </RadioGroup>
      )}
    />
  );
}
