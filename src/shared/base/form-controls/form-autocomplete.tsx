'use client';
import { type Key, type ReactNode, useEffect, useState } from 'react';
import {
  type Control,
  Controller,
  FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ISelectOption } from '../heorui-overrides/select';
import { AutocompleteProps } from '@heroui/react';
import KidstopAutocomplete from '../heorui-overrides/autocomplete';
import { ControlWithFormProps } from '@/lib/types/controller.types';

function BaseFormAutocomplete({
  items,
  invalid,
  field,
  onSelectIcon,
  ...autocompleteProps
}: {
  items: ISelectOption[];
  invalid: boolean;
  field: any;
  onSelectIcon?: ReactNode;
} & Partial<AutocompleteProps>) {
  const [fieldState, setFieldState] = useState({
    items: [] as ISelectOption[],
    selectedKey: '',
    inputValue: '',
    indexedItems: {} as any,
  });

  useEffect(() => {
    const indexed: any = items.reduce((acc: any, item: any) => {
      acc[item.value] = item;
      return acc;
    }, {});
    setFieldState((prev) => ({
      ...prev,
      items,
      indexedItems: indexed,
      inputValue: indexed[prev.selectedKey]?.label ?? prev.inputValue,
    }));
  }, [items]);

  useEffect(() => {
    if (field.value !== '') {
      setFieldState((prev) => ({
        ...prev,
        selectedKey: field.value ?? '',
        inputValue: prev?.indexedItems[field.value]?.label ?? '',
      }));
    }
  }, [field.value]);

  const handleSelection = (value: Key) => {
    if (value !== null && value !== fieldState.selectedKey) {
      field.onChange(value);
      setFieldState((prev: any) => ({
        ...prev,
        selectedKey: value as string,
        inputValue: prev?.indexedItems[value as string]?.label ?? '',
      }));
    }
  };

  const handleInput = (value: string) => {
    if (value !== fieldState.inputValue) {
      field.onChange('');
      setFieldState((prev) => ({
        ...prev,
        inputValue: value,
        selectedKey: '',
      }));
    }
  };

  return (
    <KidstopAutocomplete
      {...autocompleteProps}
      items={items}
      isInvalid={invalid}
      inputValue={fieldState.inputValue}
      selectedKey={fieldState.selectedKey}
      onInputChange={(e) => {
        autocompleteProps.onInputChange?.(e);
        handleInput(e);
      }}
      onSelect={(e) => {
        return e;
      }}
      onSelectionChange={(e) => {
        if (e) {
          autocompleteProps.onSelectionChange?.(e);
          handleSelection(e);
        }
      }}
      startContent={
        fieldState.selectedKey !== null && fieldState.selectedKey !== ''
          ? (onSelectIcon ?? (
              <Icon
                icon='iconoir:verified-user'
                className='-mr-[1px] h-5 text-xl'
              />
            ))
          : ''
      }
    />
  );
}

interface AutocompleteFormProps<T extends FieldValues>
  extends Partial<AutocompleteProps> {
  items: ISelectOption[];
  controlProps: ControlWithFormProps<T>;
  onSelectIcon?: ReactNode;
}

export default function FormAutocomplete<T extends FieldValues>({
  items,
  controlProps,
  onSelectIcon = <Icon icon='solar:check-square-linear' />,
  ...autocompleteProps
}: AutocompleteFormProps<T>) {
  return (
    <Controller
      {...controlProps}
      render={({ field, fieldState: { invalid } }) => {
        return (
          <BaseFormAutocomplete
            items={items}
            invalid={invalid}
            field={field}
            onSelectIcon={onSelectIcon}
            {...autocompleteProps}
          />
        );
      }}
    />
  );
}
