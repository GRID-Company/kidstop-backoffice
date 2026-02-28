'use client';

import { useState, useEffect, useMemo, type Key } from 'react';
import KidstopAutocomplete from './autocomplete';
import { type ISelectOption } from './select';

interface AutocompleteFilterProps {
  label: string;
  placeholder: string;
  items: ISelectOption[];
  onSelectionChange: (value: string) => void;
  resetKey?: number;
  'aria-label'?: string;
}

export default function AutocompleteFilter({
  label,
  placeholder,
  items,
  onSelectionChange,
  resetKey,
  'aria-label': ariaLabel,
}: AutocompleteFilterProps) {
  const [selectedKey, setSelectedKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [indexedItems, setIndexedItems] = useState<Record<string, ISelectOption>>({});

  useEffect(() => {
    const indexed = items.reduce<Record<string, ISelectOption>>((acc, item) => {
      acc[item.value] = item;
      return acc;
    }, {});
    setIndexedItems(indexed);
  }, [items]);

  useEffect(() => {
    if (resetKey === undefined) return;
    setSelectedKey('');
    setInputValue('');
  }, [resetKey]);

  const filteredItems = useMemo(() => {
    if (!inputValue.trim() || selectedKey) return items;
    const term = inputValue.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(term));
  }, [items, inputValue, selectedKey]);

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) {
      setSelectedKey('');
      setInputValue('');
      onSelectionChange('');
      return;
    }
    const value = key as string;
    setSelectedKey(value);
    setInputValue(indexedItems[value]?.label ?? '');
    onSelectionChange(value);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value === '') {
      setSelectedKey('');
      onSelectionChange('');
    } else {
      setSelectedKey('');
    }
  };

  return (
    <KidstopAutocomplete
      label={label}
      placeholder={placeholder}
      items={filteredItems}
      selectedKey={selectedKey}
      inputValue={inputValue}
      onSelectionChange={handleSelectionChange}
      onInputChange={handleInputChange}
      aria-label={ariaLabel}
    />
  );
}
