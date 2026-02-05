import { WindowForm } from '@/features/windows/adapters/forms/window.form.schema';
import { WindowTypeLabel } from '@/features/windows/domain/windows.domain';
import { ControlWithFormProps } from '@/lib/types/controller.types';
import SelectForm from '@/shared/base/form-controls/select-form';
import { useWatch } from 'react-hook-form';

interface SubwindowSelectProps {
  controlProps: ControlWithFormProps<WindowForm>;
}

export default function SubwindowSelect({
  controlProps,
}: SubwindowSelectProps) {
  const subWindows = useWatch({
    control: controlProps.control,
    name: 'subWindows',
  });
  const options = subWindows.map((subWindow, index) => ({
    value: index,
    label:
      WindowTypeLabel[subWindow.windowType as keyof typeof WindowTypeLabel] ||
      '-',
  }));

  const selectValue = useWatch({
    control: controlProps.control,
    name: controlProps.name,
  });
  let bg = 'bg-white';
  if (selectValue === '0') bg = '!bg-[#E5EEFF]';
  if (selectValue === '1') bg = '!bg-[#FFE8D1]';

  return (
    <SelectForm
      placeholder='Elige '
      className='w-[130px]'
      size='sm'
      variant='flat'
      radius='full'
      items={options}
      controlProps={controlProps}
      classNames={{
        trigger: ['border-0', bg],
      }}
    />
  );
}
