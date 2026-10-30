'use client';

import { Chip } from '@heroui/react';
import { TCGType, TCG_TYPES } from '@/lib/types/tcg.types';
import { CardLanguage } from '@/lib/api/schema-types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';

interface CardAttributeChipsProps {
  tcgType: TCGType;
  isFoil?: boolean | null;
  variant?: string | null;
  language?: CardLanguage | string | null;
  type?: string | null;
  hp?: string | null;
  stage?: string | null;
  rarity?: string | null;
  className?: string;
  testId?: string;
}

const CHIP_CLASS = 'h-5 px-1.5 text-[10px]';
const ACCENT_CHIP_CLASS = `bg-accent-soft ${CHIP_CLASS}`;

export default function CardAttributeChips({
  tcgType,
  isFoil,
  variant,
  language,
  type,
  hp,
  stage,
  rarity,
  className,
  testId = 'card-attribute-chips',
}: CardAttributeChipsProps) {
  const languageLabel = language
    ? (LANGUAGE_LABELS[language as CardLanguage] ?? language)
    : null;
  const showVariant = !!variant && !variant.toLowerCase().includes('normal');

  const hasChips =
    (tcgType === TCG_TYPES.MAGIC && isFoil != null) ||
    showVariant ||
    !!languageLabel ||
    !!type ||
    !!hp ||
    !!stage ||
    !!rarity;

  if (!hasChips) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-1 ${className ?? ''}`}
      data-testid={testId}
    >
      {tcgType === TCG_TYPES.MAGIC && isFoil === true && (
        <Chip
          size='sm'
          variant='flat'
          color='warning'
          className={CHIP_CLASS}
          data-testid='card-chip-foil'
        >
          ✧ Foil
        </Chip>
      )}
      {tcgType === TCG_TYPES.MAGIC && isFoil === false && (
        <Chip
          size='sm'
          variant='flat'
          className={ACCENT_CHIP_CLASS}
          classNames={{ content: 'text-accent-text' }}
          data-testid='card-chip-non-foil'
        >
          Non-Foil
        </Chip>
      )}
      {showVariant && (
        <Chip
          size='sm'
          variant='flat'
          className={ACCENT_CHIP_CLASS}
          classNames={{ content: 'text-accent-text' }}
          data-testid='card-chip-variant'
        >
          {variant}
        </Chip>
      )}
      {languageLabel && (
        <Chip
          size='sm'
          variant='flat'
          color='primary'
          className={CHIP_CLASS}
          data-testid='card-chip-language'
        >
          {languageLabel}
        </Chip>
      )}
      {type && (
        <Chip
          size='sm'
          variant='flat'
          className={CHIP_CLASS}
          startContent={<PokemonTypeIcon type={type} size='sm' />}
          data-testid='card-chip-type'
        >
          {type}
        </Chip>
      )}
      {hp && (
        <Chip
          size='sm'
          variant='flat'
          className={CHIP_CLASS}
          data-testid='card-chip-hp'
        >
          HP {hp}
        </Chip>
      )}
      {stage && (
        <Chip
          size='sm'
          variant='flat'
          className={CHIP_CLASS}
          data-testid='card-chip-stage'
        >
          {stage}
        </Chip>
      )}
      {rarity && (
        <Chip
          size='sm'
          variant='flat'
          className={CHIP_CLASS}
          data-testid='card-chip-rarity'
        >
          {rarity}
        </Chip>
      )}
    </div>
  );
}
