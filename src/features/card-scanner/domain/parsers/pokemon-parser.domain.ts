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

export function parsePokemonCard(
  regionalOcr: IRegionalOcrResult
): IExtractedCardData {
  const name = extractPokemonName(regionalOcr);
  const hp = extractHP(regionalOcr);
  const { collectorNumber, printedTotal } =
    extractPokemonCollectorNumber(regionalOcr);
  const setCode = extractPokemonSetCode(regionalOcr);
  const rarity = extractRarity(regionalOcr);
  const language = detectLanguage(regionalOcr.fullText);
  const printedYear = extractYear(regionalOcr.fullText);
  const setSymbol = createEmptyField();

  return {
    name,
    collectorNumber,
    printedTotal,
    setCode,
    setSymbol,
    hp,
    rarity,
    language,
    printedYear,
  };
}

export function extractPokemonName(
  regionalOcr: IRegionalOcrResult
): IExtractedField {
  const nameRegion = regionalOcr.regions['name'];

  if (!nameRegion || !nameRegion.text) {
    return createEmptyField();
  }

  let text = nameRegion.text.trim();

  text = text.replace(/\bHP\s*\d+/gi, '');
  text = text.replace(/\d+\s*HP\b/gi, '');
  text = text.replace(/\bPV\s*\d+/gi, '');
  text = text.replace(/\d+\s*PV\b/gi, '');
  text = text.replace(/\bKP\s*\d+/gi, '');
  text = text.replace(/\d+\s*KP\b/gi, '');

  text = text.replace(
    /\b(Basic|Stage 1|Stage 2|VMAX|VSTAR|V|GX|EX|ex)\b/gi,
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

export function extractHP(
  regionalOcr: IRegionalOcrResult
): IExtractedField<number> {
  const hpRegion = regionalOcr.regions['hp'];
  const nameRegion = regionalOcr.regions['name'];

  const searchTexts: Array<{ text: string; region: string }> = [];

  if (hpRegion?.text) {
    searchTexts.push({ text: hpRegion.text, region: 'hp' });
  }

  if (nameRegion?.text) {
    searchTexts.push({ text: nameRegion.text, region: 'name' });
  }

  for (const { text, region } of searchTexts) {
    const hpPatterns = [
      /HP\s*(\d+)/i,
      /(\d+)\s*HP/i,
      /PV\s*(\d+)/i,
      /(\d+)\s*PV/i,
      /KP\s*(\d+)/i,
      /(\d+)\s*KP/i,
    ];

    for (const pattern of hpPatterns) {
      const match = text.match(pattern);
      if (match) {
        const hp = parseInt(match[1], 10);

        if (hp >= 10 && hp <= 500) {
          const confidence = calculateFieldConfidence(
            match[0],
            hp.toString(),
            regionalOcr.regions[region]?.averageConfidence || 0
          );

          return createExtractedField(hp, hp, confidence, [region], [match[0]]);
        }
      }
    }
  }

  return createEmptyField<number>();
}

export function extractPokemonCollectorNumber(
  regionalOcr: IRegionalOcrResult
): {
  collectorNumber: IExtractedField;
  printedTotal: IExtractedField;
} {
  const footerRegion = regionalOcr.regions['footer'];

  if (!footerRegion || !footerRegion.text) {
    return {
      collectorNumber: createEmptyField(),
      printedTotal: createEmptyField(),
    };
  }

  const text = correctCommonOCRErrors(footerRegion.text);

  const patterns = [
    /([A-Z]{2,4}\d+)\s*\/\s*([A-Z]{2,4}\d+)[★\s]*/,
    /([A-Z]{2}\d+)\s*\/\s*([A-Z]{2}\d+)[★\s]*/,
    /(\d+)\s*\/\s*(\d+)/,
    /([A-Z]+\d+)\s*\/\s*([A-Z]+\d+)/,
    /(\d+)\s*\/\s*([A-Z]+)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const rawNumber = match[1];
      const rawTotal = match[2];

      const normalizedNumber = normalizeCollectorNumber(rawNumber);
      const normalizedTotal = normalizeCollectorNumber(rawTotal);

      const confidence = calculateFieldConfidence(
        match[0],
        normalizedNumber,
        footerRegion.averageConfidence || 0
      );

      return {
        collectorNumber: createExtractedField(
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
    collectorNumber: createEmptyField(),
    printedTotal: createEmptyField(),
  };
}

export function extractPokemonSetCode(
  regionalOcr: IRegionalOcrResult
): IExtractedField {
  const footerRegion = regionalOcr.regions['footer'];

  if (!footerRegion || !footerRegion.text) {
    return createEmptyField();
  }

  const text = footerRegion.text;

  const setCodePattern = /\b([A-Z]{2,4}\d+|[A-Z]{2,4})\b/g;
  const matches = Array.from(text.matchAll(setCodePattern));

  if (matches.length === 0) {
    return createEmptyField();
  }

  const potentialCodes = matches
    .map((m) => m[1])
    .filter((code) => {
      return code.length >= 2 && code.length <= 6;
    });

  if (potentialCodes.length === 0) {
    return createEmptyField();
  }

  const setCode = potentialCodes[potentialCodes.length - 1];

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

export function extractRarity(
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
    'rare holo': 'rare holo',
    'ultra rare': 'ultra rare',
    'secret rare': 'secret rare',
    promo: 'promo',
    c: 'common',
    u: 'uncommon',
    r: 'rare',
    h: 'rare holo',
    ur: 'ultra rare',
    sr: 'secret rare',
    p: 'promo',
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
