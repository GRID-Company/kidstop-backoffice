import { CardLanguage } from '@/lib/api/schema-types';

export const MODIFIABLE_LANGUAGES = [
  CardLanguage.English,
  CardLanguage.Spanish,
] as const;

export const NON_MODIFIABLE_LANGUAGES = [
  CardLanguage.Korean,
  CardLanguage.Chinese,
  CardLanguage.Japanese,
] as const;

export const LANGUAGE_LABELS: Record<CardLanguage, string> = {
  [CardLanguage.English]: 'English',
  [CardLanguage.Spanish]: 'Spanish',
  [CardLanguage.Korean]: 'Korean',
  [CardLanguage.Chinese]: 'Chinese',
  [CardLanguage.Japanese]: 'Japanese',
};

export function isLanguageModifiable(language: CardLanguage): boolean {
  return MODIFIABLE_LANGUAGES.includes(language as any);
}
