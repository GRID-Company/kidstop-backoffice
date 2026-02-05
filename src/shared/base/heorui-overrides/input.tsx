import { extendVariants, Input } from '@heroui/react';

const InputBase = extendVariants(Input, {
  variants: {
    color: {
      default: {
        inputWrapper: '!border-[1px] bg-white',
      },
    },
  },
  defaultVariants: {
    variant: 'bordered',
    size: 'md',
    color: 'default',
  },
});

type OverrideInputProps = React.ComponentProps<typeof InputBase>;
const OverrideInput = (props: OverrideInputProps) => <InputBase {...props} />;

export default OverrideInput;
