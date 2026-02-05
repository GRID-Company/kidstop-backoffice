import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export type ControlWithFormProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
};
