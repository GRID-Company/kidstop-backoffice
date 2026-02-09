import { extendVariants, DateRangePicker } from '@heroui/react';

const BaseDateRangePicker = extendVariants(DateRangePicker, {
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

type OverrideDateRangePickerProps = React.ComponentProps<typeof BaseDateRangePicker>;
const OverrideDateRangePicker = (props: OverrideDateRangePickerProps) => (
  <BaseDateRangePicker {...props} />
);

export default OverrideDateRangePicker;
