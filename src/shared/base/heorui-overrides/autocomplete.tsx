import {
  AutocompleteProps,
  AutocompleteItem,
  Autocomplete,
} from '@heroui/react';
import { type ISelectOption } from './select';

export interface IAutocompleteOption {
  value: string;
  label: string;
}

export default function KidstopAutocomplete({
  ...autocompleteProps
}: {} & Partial<AutocompleteProps>) {
  return (
    <Autocomplete
      variant='bordered'
      classNames={{
        listboxWrapper: 'max-h-[320px]',
        selectorButton: 'text-default-500',
      }}
      inputProps={{
        classNames: {
          inputWrapper: '!border-[1px] bg-white',
        },
      }}
      listboxProps={{}}
      allowsCustomValue={true}
      {...autocompleteProps}
    >
      {(item: any) => (
        <AutocompleteItem key={item.value} textValue={item.label}>
          <div className='max-w-full truncate'>
            <span className='line-clamp-2 block overflow-hidden text-ellipsis whitespace-normal'>
              {item.label}
            </span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
