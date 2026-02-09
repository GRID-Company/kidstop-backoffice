import { DateRangePicker, DateRangePickerProps } from '@heroui/react';
import type { DateValue } from '@internationalized/date';

type OverrideDateRangePickerProps = Omit<DateRangePickerProps<DateValue>, 'classNames'> & {
  classNames?: DateRangePickerProps<DateValue>['classNames'];
};

export default function OverrideDateRangePicker(props: OverrideDateRangePickerProps) {
  return (
    <DateRangePicker
      variant="bordered"
      size="md"
      {...props}
      classNames={{
        ...props.classNames,
        inputWrapper: `!border-[1px] bg-white ${props.classNames?.inputWrapper ?? ''}`,
      }}
      calendarProps={{
        ...props.calendarProps,
        classNames: {
          ...props.calendarProps?.classNames,
          cellButton: [
            'data-[selected=true]:bg-accent data-[selected=true]:text-white',
            'data-[hover=true]:bg-accent/20',
            'data-[selection-start=true]:bg-accent data-[selection-end=true]:bg-accent',
            props.calendarProps?.classNames?.cellButton ?? '',
          ].join(' '),
          title: `text-accent ${props.calendarProps?.classNames?.title ?? ''}`,
        },
      }}
    />
  );
}
