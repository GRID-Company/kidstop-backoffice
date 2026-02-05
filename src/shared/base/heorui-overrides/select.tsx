import {
  Select as NextSelect,
  SelectItem,
  Checkbox,
  extendVariants,
  SelectProps,
} from '@heroui/react';

const BaseSelect = extendVariants(NextSelect, {
  variants: {},
  defaultVariants: {
    variant: 'bordered',
    radius: 'md',
    color: 'default',
  },
});

export interface ISelectOption {
  value: string;
  label: string;
}

const CanalviSelect = ({ ...selectProps }: Partial<SelectProps>) => {
  const { items, selectionMode, selectedKeys, classNames } = selectProps;
  return (
    <BaseSelect
      {...selectProps}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      classNames={{
        trigger: 'border-[1px] bg-white',
        ...(classNames || {}),
      }}
    >
      {selectProps.children ||
        (items as ISelectOption[])?.map((item) => (
          <SelectItem key={item.value} textValue={item.label}>
            <div className='flex items-center gap-2'>
              {selectionMode === 'multiple' && (
                <Checkbox
                  color='default'
                  classNames={{
                    wrapper: 'after:bg-white',
                    icon: 'text-primary-600',
                  }}
                  isSelected={
                    (selectedKeys as Set<string> | undefined)?.has(
                      item.value
                    ) ?? false
                  }
                  className='pointer-events-none'
                />
              )}
              {item.label}
            </div>
          </SelectItem>
        ))}
    </BaseSelect>
  );
};

export default CanalviSelect;
