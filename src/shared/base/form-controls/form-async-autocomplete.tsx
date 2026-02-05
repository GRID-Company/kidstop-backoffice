'use client';
import { type Key, type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  type Control,
  Controller,
  FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ISelectOption } from '../heorui-overrides/select';
import { AutocompleteProps } from '@heroui/react';
import CanalviAutocomplete from '../heorui-overrides/autocomplete';
import { ControlWithFormProps } from '@/lib/types/controller.types';
import { useQuery } from '@apollo/client/react';
import { DocumentNode } from 'graphql';

type AsyncQueryConfig<
  TData = any,
  TVariables extends Record<string, any> = Record<string, any>,
> = {
  field: any;
  onSelectIcon?: ReactNode;
  queryDocument: DocumentNode;
  variables: TVariables;
  mapResToItems: (data: any) => ISelectOption[];
  skipQuery?: boolean;
} & Partial<AutocompleteProps>;

function BaseFormAsyncAutocomplete<
  TData = any,
  TVariables extends Record<string, any> = Record<string, any>,
>({
  queryDocument,
  variables,
  mapResToItems,
  skipQuery = false,
  field,
  onSelectIcon,
  ...autocompleteProps
}: AsyncQueryConfig<TData, TVariables>) {
  const [fieldState, setFieldState] = useState({
    selectedKey: '',
    inputValue: '',
  });
  const [searchValue, setSearchValue] = useState('');

  const memoizedVariables = useMemo(
    () =>
      ({
        ...(variables ?? ({} as TVariables)),
        ...(searchValue
          ? {
              [Object.keys(variables)[0]]: {
                ...variables[Object.keys(variables)[0]],
                search: searchValue,
              },
            }
          : {}),
      }) as TVariables,
    [variables, searchValue]
  );

  console.log(memoizedVariables);

  const { data: res, loading } = useQuery<TData, TVariables>(queryDocument, {
    variables: memoizedVariables,
    skip: skipQuery,
  });

  const items: ISelectOption[] = useMemo(
    () => (mapResToItems ? mapResToItems(res) : []),
    [res, mapResToItems]
  );

  const indexedItems = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc[item.value] = item;
          return acc;
        },
        {} as Record<string, ISelectOption>
      ),
    [items]
  );

  useEffect(() => {
    setFieldState((prev) => ({
      ...prev,
      inputValue: indexedItems[prev.selectedKey]?.label ?? prev.inputValue,
    }));
  }, [indexedItems]);

  useEffect(() => {
    if (field.value !== '') {
      setFieldState((prev) => ({
        ...prev,
        selectedKey: field.value ?? '',
        inputValue: indexedItems[field.value]?.label ?? prev.inputValue,
      }));
    }
  }, [field.value, indexedItems]);

  const handleSelection = (value: Key) => {
    if (value !== null && value !== fieldState.selectedKey) {
      field.onChange(value);
      setFieldState((prev) => ({
        ...prev,
        selectedKey: value as string,
        inputValue: indexedItems[value as string]?.label ?? prev.inputValue,
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
      setSearchValue(value);
    }
  };

  return (
    <CanalviAutocomplete
      {...autocompleteProps}
      items={items}
      isLoading={loading}
      inputValue={fieldState.inputValue}
      selectedKey={fieldState.selectedKey}
      onInputChange={(value) => {
        autocompleteProps.onInputChange?.(value);
        handleInput(value);
      }}
      onSelect={(e) => e}
      onSelectionChange={(key) => {
        if (key) {
          autocompleteProps.onSelectionChange?.(key);
          handleSelection(key);
        }
      }}
      startContent={
        fieldState.selectedKey !== null && fieldState.selectedKey !== ''
          ? onSelectIcon
          : ''
      }
    />
  );
}

type AsyncAutocompleteFormProps<
  TFieldValues extends FieldValues,
  TData = any,
  TVariables extends Record<string, any> = Record<string, any>,
> = Omit<AsyncQueryConfig<TData, TVariables>, 'field'> & {
  controlProps: ControlWithFormProps<TFieldValues>;
};

export default function FormAsyncAutocomplete<
  TFieldValues extends FieldValues,
  TData,
  TVariables extends Record<string, any>,
>({
  queryDocument,
  variables,
  mapResToItems,
  controlProps,
  onSelectIcon = <Icon icon='solar:check-square-linear' />,
  skipQuery,
  ...autocompleteProps
}: AsyncAutocompleteFormProps<TFieldValues, TData, TVariables>) {
  return (
    <Controller
      {...controlProps}
      render={({ field, fieldState: { invalid } }) => {
        return (
          <BaseFormAsyncAutocomplete<TData, TVariables>
            queryDocument={queryDocument}
            variables={variables}
            mapResToItems={mapResToItems}
            skipQuery={skipQuery}
            field={field}
            onSelectIcon={onSelectIcon}
            isInvalid={invalid}
            {...autocompleteProps}
          />
        );
      }}
    />
  );
}
