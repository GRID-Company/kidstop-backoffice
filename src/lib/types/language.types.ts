import { CardLanguage } from '@/lib/api/schema-types';

/**
 * Default language for cards when no language is specified.
 * Used as fallback in forms and card creation flows.
 */
export const DEFAULT_CARD_LANGUAGE = CardLanguage.English;

/**
 * Languages that can be modified by users in the language selector.
 * Business Rule: Only English and Spanish cards can have their language changed.
 */
export const MODIFIABLE_LANGUAGES = [
  CardLanguage.English,
  CardLanguage.Spanish,
] as const;

/**
 * Languages that cannot be modified once set.
 * Business Rule: Korean, Chinese, and Japanese cards are read-only for language.
 * These languages are determined by the card's original printing and cannot be changed.
 */
export const NON_MODIFIABLE_LANGUAGES = [
  CardLanguage.Korean,
  CardLanguage.Chinese,
  CardLanguage.Japanese,
] as const;

/**
 * Human-readable labels for each card language.
 * Used for display in UI components like selectors and chips.
 */
export const LANGUAGE_LABELS: Record<CardLanguage, string> = {
  [CardLanguage.English]: 'English',
  [CardLanguage.Spanish]: 'Spanish',
  [CardLanguage.Korean]: 'Korean',
  [CardLanguage.Chinese]: 'Chinese',
  [CardLanguage.Japanese]: 'Japanese',
};

/**
 * Determines if a card language can be modified by the user.
 * 
 * @param language - The card language to check
 * @returns true if the language is modifiable (English or Spanish), false otherwise
 * 
 * @example
 * ```typescript
 * isLanguageModifiable(CardLanguage.English) // true
 * isLanguageModifiable(CardLanguage.Korean)  // false
 * ```
 */
export function isLanguageModifiable(language: CardLanguage): boolean {
  return (MODIFIABLE_LANGUAGES as readonly CardLanguage[]).includes(language);
}
