import { Controller, FieldValues } from 'react-hook-form';
import { CheckboxProps } from '@heroui/react';
import { Checkbox } from '@heroui/react';
import { ControlWithFormProps } from '@/lib/types/controller.types';

interface CheckboxFormProps<T extends FieldValues> extends Partial<CheckboxProps> {
  controlProps: ControlWithFormProps<T>;
}

export default function CheckboxForm<T extends FieldValues>({
  controlProps,
  ...checkboxProps
}: CheckboxFormProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({ field }) => (
        <Checkbox
          {...checkboxProps}
          isSelected={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      )}
    />
  );
}
