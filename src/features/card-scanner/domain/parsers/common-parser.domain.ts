import { IExtractedField } from '../types';

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

export function cleanText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-/]/gi, '');
}

export function extractNumberFromText(text: string): number | null {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function removeNonAlphanumeric(text: string): string {
  return text.replace(/[^a-zA-Z0-9\s]/g, '');
}

export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function correctCommonOCRErrors(text: string): string {
  return text
    .replace(/\bO(\d)/g, '0$1')
    .replace(/(\d)O\b/g, '$10')
    .replace(/\bl(\d)/g, '1$1')
    .replace(/(\d)l\b/g, '$11')
    .replace(/\bI(\d)/g, '1$1')
    .replace(/(\d)I\b/g, '$11');
}
