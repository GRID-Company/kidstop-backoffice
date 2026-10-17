import { CardLanguage } from '@/lib/api/schema-types';
import { TCG_TYPES, TCGType } from './tcg.types';

/**
 * Default language for cards when no language is specified.
 * Used as fallback in forms and card creation flows.
 */
export const DEFAULT_CARD_LANGUAGE = CardLanguage.English;

/**
 * All card languages accepted by the backend, for use in selectors and filters.
 */
export const CARD_LANGUAGE_OPTIONS = Object.values(CardLanguage);

/**
 * Human-readable labels for ISO 639-1 codes returned by `detectedLanguage` (card scanner).
 */
export const ISO_LANGUAGE_LABELS: Record<string, string> = {
  en: 'Inglés',
  es: 'Español',
  ja: 'Japonés',
  ko: 'Coreano',
  zh: 'Chino',
  fr: 'Francés',
  de: 'Alemán',
  it: 'Italiano',
  pt: 'Portugués',
  ru: 'Ruso',
};

/**
 * Human-readable labels for each card language.
 * Used for display in UI components like selectors and chips.
 */
export const LANGUAGE_LABELS: Record<CardLanguage, string> = {
  [CardLanguage.English]: 'Inglés',
  [CardLanguage.Spanish]: 'Español',
  [CardLanguage.Korean]: 'Coreano',
  [CardLanguage.Chinese]: 'Chino',
  [CardLanguage.Japanese]: 'Japonés',
  [CardLanguage.French]: 'Francés',
  [CardLanguage.German]: 'Alemán',
  [CardLanguage.Italian]: 'Italiano',
  [CardLanguage.Portuguese]: 'Portugués',
  [CardLanguage.Russian]: 'Ruso',
};

const POKEMON_LANGUAGES_BY_PRINTING: Partial<
  Record<CardLanguage, CardLanguage[]>
> = {
  [CardLanguage.English]: [CardLanguage.English, CardLanguage.Spanish],
  [CardLanguage.Spanish]: [CardLanguage.Spanish, CardLanguage.English],
};

/**
 * Languages selectable for a card in inventory/purchases.
 * Magic accepts all languages. Pokemon is restricted by the card's printed
 * language (EN↔ES interchangeable; other languages are locked to the printing).
 */
export function getCardLanguageOptions(
  tcgType: TCGType,
  printedLanguage?: CardLanguage | null
): CardLanguage[] {
  if (tcgType === TCG_TYPES.MAGIC) {
    return CARD_LANGUAGE_OPTIONS;
  }
  if (!printedLanguage) {
    return [CardLanguage.English, CardLanguage.Spanish];
  }
  return POKEMON_LANGUAGES_BY_PRINTING[printedLanguage] ?? [printedLanguage];
}
