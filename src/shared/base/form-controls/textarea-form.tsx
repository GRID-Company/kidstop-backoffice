import { Controller, FieldValues } from 'react-hook-form';
import { TextAreaProps } from '@heroui/react';
import { ControlWithFormProps } from '@/lib/types/controller.types';
import OverrideTextarea from '../heorui-overrides/textarea';

interface TextareaFormProps<T extends FieldValues>
  extends Partial<TextAreaProps> {
  controlProps: ControlWithFormProps<T>;
}

export default function TextareaForm<T extends FieldValues>({
  controlProps,
  ...inputProps
}: TextareaFormProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({ field, fieldState: { invalid } }) => (
        <OverrideTextarea isInvalid={invalid} {...inputProps} {...field} />
      )}
    />
  );
}
