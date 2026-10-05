import {
  IExtractedCardData,
  IExtractedField,
  IRegionalOcrResult,
} from '../types';
import {
  calculateFieldConfidence,
  correctCommonOCRErrors,
  createEmptyField,
  createExtractedField,
  detectLanguage,
  extractYear,
  normalizeCollectorNumber,
  normalizeWhitespace,
} from './common-parser.domain';

export function parseMagicCard(
  regionalOcr: IRegionalOcrResult
): IExtractedCardData {
  const name = extractMagicName(regionalOcr);
  const collectorNumber = extractMagicCollectorNumber(regionalOcr);
  const setCode = extractMagicSetCode(regionalOcr);
  const rarity = extractMagicRarity(regionalOcr);
  const language = detectLanguage(regionalOcr.fullText);
  const printedYear = extractYear(regionalOcr.fullText);

  return {
    name,
    collectorNumber,
    printedTotal: collectorNumber.printedTotal || createEmptyField(),
    setCode,
    setSymbol: createEmptyField(),
    hp: createEmptyField<number>(),
    rarity,
    language,
    printedYear,
  };
}

export function extractMagicName(
  regionalOcr: IRegionalOcrResult
): IExtractedField {
  const nameRegion = regionalOcr.regions['name'];

  if (!nameRegion || !nameRegion.text) {
    return createEmptyField();
  }

  let text = nameRegion.text.trim();

  text = text.replace(/\{[WUBRGC0-9X]+\}/g, '');
  text = text.replace(
    /\b(Legendary|Creature|Instant|Sorcery|Enchantment|Artifact|Planeswalker|Land)\b/gi,
    ''
  );

  text = normalizeWhitespace(text);

  if (!text || text.length < 2) {
    return createEmptyField();
  }

  const confidence = calculateFieldConfidence(
    nameRegion.text,
    text,
    nameRegion.averageConfidence || 0
  );

  return createExtractedField(
    text,
    text,
    confidence,
    ['name'],
    [nameRegion.text]
  );
}

export function extractMagicCollectorNumber(
  regionalOcr: IRegionalOcrResult
): IExtractedField & {
  printedTotal?: IExtractedField;
} {
  const footerRegion = regionalOcr.regions['footer'];

  if (!footerRegion || !footerRegion.text) {
    return {
      ...createEmptyField(),
      printedTotal: createEmptyField(),
    };
  }

  const text = correctCommonOCRErrors(footerRegion.text);

  const patterns = [
    /\b(\d+)\/(\d+)\s+([A-Z]{2,4})\b/,
    /\b([A-Z]{2,4})\s+(\d+)\/(\d+)\b/,
    /\b(\d+)\/(\d+)\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let rawNumber: string;
      let rawTotal: string;
      let _rawSet: string | undefined;

      if (match[3]) {
        if (/^\d+$/.test(match[1])) {
          rawNumber = match[1];
          rawTotal = match[2];
          _rawSet = match[3];
        } else {
          _rawSet = match[1];
          rawNumber = match[2];
          rawTotal = match[3];
        }
      } else {
        rawNumber = match[1];
        rawTotal = match[2];
      }

      const normalizedNumber = normalizeCollectorNumber(rawNumber);
      const normalizedTotal = normalizeCollectorNumber(rawTotal);

      const confidence = calculateFieldConfidence(
        match[0],
        normalizedNumber,
        footerRegion.averageConfidence || 0
      );

      return {
        ...createExtractedField(
          rawNumber,
          normalizedNumber,
          confidence,
          ['footer'],
          [match[0]]
        ),
        printedTotal: createExtractedField(
          rawTotal,
          normalizedTotal,
          confidence,
          ['footer'],
          [match[0]]
        ),
      };
    }
  }

  return {
    ...createEmptyField(),
    printedTotal: createEmptyField(),
  };
}

export function extractMagicSetCode(
  regionalOcr: IRegionalOcrResult
): IExtractedField {
  const footerRegion = regionalOcr.regions['footer'];

  if (!footerRegion || !footerRegion.text) {
    return createEmptyField();
  }

  const text = footerRegion.text;

  const setCodePattern = /\b([A-Z]{2,4})\b/g;
  const matches = Array.from(text.matchAll(setCodePattern));

  if (matches.length === 0) {
    return createEmptyField();
  }

  const potentialCodes = matches
    .map((m) => m[1])
    .filter((code) => {
      return code.length >= 2 && code.length <= 4 && !/^\d+$/.test(code);
    });

  if (potentialCodes.length === 0) {
    return createEmptyField();
  }

  const setCode = potentialCodes[0];

  const confidence = calculateFieldConfidence(
    setCode,
    setCode,
    footerRegion.averageConfidence || 0
  );

  return createExtractedField(
    setCode,
    setCode,
    confidence * 0.7,
    ['footer'],
    [setCode]
  );
}

export function extractMagicRarity(
  regionalOcr: IRegionalOcrResult
): IExtractedField {
  const footerRegion = regionalOcr.regions['footer'];

  if (!footerRegion || !footerRegion.text) {
    return createEmptyField();
  }

  const text = footerRegion.text.toLowerCase();

  const rarityMap: Record<string, string> = {
    common: 'common',
    uncommon: 'uncommon',
    rare: 'rare',
    'mythic rare': 'mythic rare',
    mythic: 'mythic rare',
    c: 'common',
    u: 'uncommon',
    r: 'rare',
    m: 'mythic rare',
  };

  for (const [key, value] of Object.entries(rarityMap)) {
    const pattern = new RegExp(`\\b${key}\\b`, 'i');
    if (pattern.test(text)) {
      const confidence = calculateFieldConfidence(
        key,
        value,
        footerRegion.averageConfidence || 0
      );

      return createExtractedField(
        value,
        value,
        confidence * 0.6,
        ['footer'],
        [key]
      );
    }
  }

  return createEmptyField();
}
