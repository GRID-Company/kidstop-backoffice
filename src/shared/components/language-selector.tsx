'use client';

import { Select, SelectItem } from '@heroui/react';
import { CardLanguage } from '@/lib/api/schema-types';
import {
  LANGUAGE_LABELS,
  MODIFIABLE_LANGUAGES,
  isLanguageModifiable,
} from '@/lib/types/language.types';

interface LanguageSelectorProps {
  value: CardLanguage;
  onChange: (language: CardLanguage) => void;
  disabled?: boolean;
  currentLanguage?: CardLanguage;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LanguageSelector({
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

  // Determinar qué idiomas mostrar
  const availableLanguages: CardLanguage[] = [...MODIFIABLE_LANGUAGES];

  // Si el idioma no es modificable, agregar el idioma actual a las opciones
  if (!isModifiable && currentLanguage) {
    if (!availableLanguages.includes(currentLanguage)) {
      availableLanguages.push(currentLanguage);
    }
  }

  // Cuando el selector está deshabilitado por idioma no modificable, mostrar el idioma de la carta
  const displayValue =
    !isModifiable && currentLanguage ? currentLanguage : value;

  return (
    <Select
      label={label}
      selectedKeys={[displayValue]}
      onChange={(e) => onChange(e.target.value as CardLanguage)}
      isDisabled={isDisabled}
      size={size}
      className={className}
      description={
        !isModifiable ? 'Este idioma no puede ser modificado' : undefined
      }
    >
      {availableLanguages.map((lang) => (
        <SelectItem key={lang}>{LANGUAGE_LABELS[lang]}</SelectItem>
      ))}
    </Select>
  );
}
