'use client';

import { Select, SelectItem } from '@heroui/react';
import { CardLanguage } from '@/lib/api/schema-types';
import { TCGType } from '@/lib/types/tcg.types';
import {
  getCardLanguageOptions,
  LANGUAGE_LABELS,
} from '@/lib/types/language.types';

interface LanguageSelectorProps {
  value: CardLanguage;
  onChange: (language: CardLanguage) => void;
  tcgType: TCGType;
  disabled?: boolean;
  currentLanguage?: CardLanguage;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LanguageSelector({
  value,
  onChange,
  tcgType,
  disabled = false,
  currentLanguage,
  label = 'Idioma',
  size = 'md',
  className,
}: LanguageSelectorProps) {
  const availableLanguages = getCardLanguageOptions(tcgType, currentLanguage);
  const isLocked = availableLanguages.length === 1;
  const displayValue = isLocked ? availableLanguages[0] : value;

  return (
    <Select
      label={label}
      selectedKeys={[displayValue]}
      onChange={(e) => onChange(e.target.value as CardLanguage)}
      isDisabled={disabled || isLocked}
      size={size}
      className={className}
      disallowEmptySelection={true}
      description={
        isLocked
          ? 'Este idioma no puede ser modificado'
          : currentLanguage && currentLanguage !== value
            ? `Impresa en ${LANGUAGE_LABELS[currentLanguage]}`
            : undefined
      }
    >
      {availableLanguages.map((lang) => (
        <SelectItem key={lang}>{LANGUAGE_LABELS[lang]}</SelectItem>
      ))}
    </Select>
  );
}
