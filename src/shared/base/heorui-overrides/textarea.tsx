import { extendVariants, Textarea } from '@heroui/react';

const TextareaBase = extendVariants(Textarea, {
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

type OverrideTextareaProps = React.ComponentProps<typeof TextareaBase>;
const OverrideTextarea = (props: OverrideTextareaProps) => (
  <TextareaBase {...props} />
);

export default OverrideTextarea;
