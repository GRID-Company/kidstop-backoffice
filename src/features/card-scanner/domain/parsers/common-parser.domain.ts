import { IExtractedCardData, IExtractedField } from '../types';

export function createExtractedField<T = string>(
  value: T | null,
  normalizedValue: T | null,
  confidence: number,
  sourceRegions: string[],
  rawMatches: string[]
): IExtractedField<T> {
  return {
    value,
    normalizedValue,
    confidence,
    sourceRegions,
    rawMatches,
  };
}

export function createEmptyField<T = string>(): IExtractedField<T> {
  return createExtractedField<T>(null, null, 0, [], []);
}

export function createEmptyExtractedData(): IExtractedCardData {
  return {
    name: createEmptyField(),
    collectorNumber: createEmptyField(),
    printedTotal: createEmptyField(),
    setCode: createEmptyField(),
    setSymbol: createEmptyField(),
    hp: createEmptyField<number>(),
    rarity: createEmptyField(),
    language: createEmptyField(),
    printedYear: createEmptyField<number>(),
  };
}

export function detectLanguage(allText: string): IExtractedField {
  const text = allText.toLowerCase();

  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;
  const spanishPattern = /\b(hp|ps|energía|ataque|debilidad|resistencia)\b/i;
  const englishPattern = /\b(hp|attack|weakness|resistance|energy)\b/i;

  if (japanesePattern.test(allText)) {
    return createExtractedField(
      'ja',
      'ja',
      0.95,
      ['fullText'],
      ['Japanese characters detected']
    );
  }

  if (spanishPattern.test(text)) {
    return createExtractedField(
      'es',
      'es',
      0.85,
      ['fullText'],
      ['Spanish keywords detected']
    );
  }

  if (englishPattern.test(text)) {
    return createExtractedField(
      'en',
      'en',
      0.85,
      ['fullText'],
      ['English keywords detected']
    );
  }

  return createExtractedField(
    'en',
    'en',
    0.5,
    ['fullText'],
    ['Default to English']
  );
}

export function extractYear(text: string): IExtractedField<number> {
  if (!text || text.length < 4) {
    return createEmptyField<number>();
  }

  const yearPattern = /©?\s*(\d{4})/g;
  const matches = Array.from(text.matchAll(yearPattern));

  if (matches.length === 0) {
    return createEmptyField<number>();
  }

  const currentYear = new Date().getFullYear();
  const years = matches
    .map((m) => parseInt(m[1], 10))
    .filter((year) => !isNaN(year) && year >= 1993 && year <= currentYear + 2);

  if (years.length === 0) {
    return createEmptyField<number>();
  }

  const year = years[years.length - 1];

  return createExtractedField(
    year,
    year,
    0.9,
    ['footer'],
    matches.map((m) => m[0])
  );
}

export function normalizeCollectorNumber(raw: string): string {
  if (!raw) return '';
  return raw.trim().replace(/\s+/g, '').toUpperCase();
}

export function calculateFieldConfidence(
  rawMatch: string,
  normalizedValue: string,
  ocrConfidence: number
): number {
  if (!rawMatch || !normalizedValue) {
    return 0;
  }

  const lengthScore = Math.min(rawMatch.length / 3, 1);

  const hasNumbers = /\d/.test(normalizedValue);
  const hasLetters = /[a-zA-Z]/.test(normalizedValue);
  const contentScore = hasNumbers || hasLetters ? 1 : 0.5;

  const baseConfidence =
    ocrConfidence * 0.5 + lengthScore * 0.3 + contentScore * 0.2;

  return Math.max(0, Math.min(1, baseConfidence));
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function correctCommonOCRErrors(text: string): string {
  return text
    .replace(/(\d)\s+(\d)/g, '$1$2')
    .replace(/\b[Oo](\d)/g, '0$1')
    .replace(/(\d)[Oo]\b/g, '$10')
    .replace(/(\d)[Oo](\d)/g, '$10$2')
    .replace(/\b[lI](\d)/g, '1$1')
    .replace(/(\d)[lI]\b/g, '$11')
    .replace(/(\d)[lI](\d)/g, '$11$2')
    .replace(/\bS(\d)/g, '5$1')
    .replace(/(\d)S\b/g, '$15')
    .replace(/(\d)S(\d)/g, '$15$2')
    .replace(/\bB(\d)/g, '8$1')
    .replace(/(\d)B\b/g, '$18')
    .replace(/(\d)B(\d)/g, '$18$2')
    .replace(/\bG(\d)/g, '6$1')
    .replace(/(\d)G\b/g, '$16')
    .replace(/(\d)G(\d)/g, '$16$2');
}
