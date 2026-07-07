'use client';

import { Select, SelectItem } from '@heroui/react';
import { CardLanguage } from '@/lib/api/schema-types';
import { LANGUAGE_LABELS, isLanguageModifiable } from '@/lib/types/language.types';

interface LanguageSelectorProps {
  value: CardLanguage;
  onChange: (language: CardLanguage) => void;
  disabled?: boolean;
  currentLanguage?: CardLanguage;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LanguageSelector({
  value,
  onChange,
  disabled = false,
  currentLanguage,
  label = 'Idioma',
  size = 'md',
  className,
}: LanguageSelectorProps) {
  const isModifiable = currentLanguage
    ? isLanguageModifiable(currentLanguage)
    : true;

  const isDisabled = disabled || !isModifiable;

  return (
    <Select
      label={label}
      selectedKeys={[value]}
      onChange={(e) => onChange(e.target.value as CardLanguage)}
      isDisabled={isDisabled}
      size={size}
      className={className}
      description={
        !isModifiable
          ? 'Este idioma no puede ser modificado'
          : undefined
      }
    >
      <SelectItem key={CardLanguage.English}>
        {LANGUAGE_LABELS[CardLanguage.English]}
      </SelectItem>
      <SelectItem key={CardLanguage.Spanish}>
        {LANGUAGE_LABELS[CardLanguage.Spanish]}
      </SelectItem>
    </Select>
  );
}
