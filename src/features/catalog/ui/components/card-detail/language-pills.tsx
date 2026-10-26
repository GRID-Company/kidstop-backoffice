'use client';

import { Button } from '@heroui/react';
import { CardLanguage } from '@/lib/api/schema-types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';

export type LanguageFilter = CardLanguage | 'ALL';

export interface LanguageOption {
  language: CardLanguage;
  count: number;
}

interface LanguagePillsProps {
  options: LanguageOption[];
  totalCount: number;
  value: LanguageFilter;
  onChange: (value: LanguageFilter) => void;
}

export default function LanguagePills({
  options,
  totalCount,
  value,
  onChange,
}: LanguagePillsProps) {
  const pillClass = (active: boolean) =>
    `h-7 min-w-0 px-3 text-xs font-medium ${
      active ? 'bg-accent-soft text-accent-text' : 'text-default-500'
    }`;

  return (
    <div
      className='flex flex-wrap items-center gap-1'
      data-testid='language-pills'
    >
      <Button
        size='sm'
        variant='flat'
        onPress={() => onChange('ALL')}
        className={pillClass(value === 'ALL')}
        data-testid='language-pill-all'
      >
        Todos{totalCount > 0 ? ` (${totalCount})` : ''}
      </Button>
      {options.map(({ language, count }) => (
        <Button
          key={language}
          size='sm'
          variant='flat'
          onPress={() => onChange(language)}
          className={pillClass(value === language)}
          data-testid={`language-pill-${language.toLowerCase()}`}
        >
          {LANGUAGE_LABELS[language]}
          {count > 0 ? ` (${count})` : ''}
        </Button>
      ))}
    </div>
  );
}
