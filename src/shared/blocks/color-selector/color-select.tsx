import { SelectItem, SelectProps } from '@heroui/react';
import { ColorItem, ColorKey, ColorOptions } from '@/lib/types/inventory.types';
import ColorPresenter from './color-presenter';
import KidstopSelect from '@/shared/base/heorui-overrides/select';

export default function ColorSelect({ ...selectProps }: Partial<SelectProps>) {
  return (
    <KidstopSelect
      {...selectProps}
      items={ColorOptions}
      renderValue={(selected) => {
        return selected.map((item) => (
          <div key={item.key} className=''>
            <ColorPresenter color={item.key as ColorKey} />
          </div>
        ));
      }}
    >
      {(color) => (
        <SelectItem
          key={(color as ColorItem).value}
          textValue={(color as ColorItem).label}
        >
          <ColorPresenter color={(color as ColorItem).value} />
        </SelectItem>
      )}
    </KidstopSelect>
  );
}
