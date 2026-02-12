import { ICard } from './types';
import {
  DeckListFormat,
  IDeckListLine,
  IDeckListResolvedLine,
  IDeckListImportResult,
} from './deck-list-parser.types';

const MOXFIELD_LINE_REGEX = /^(\d+)\s+(.+?)\s+\(([A-Za-z0-9]+)\)\s+(\S+)$/;
const LIMITLESS_LINE_REGEX = /^(\d+)\s+(.+?)\s+([A-Za-z]{2,5})\s+(\d+)$/;
const SECTION_HEADER_REGEX = /^(Pokémon|Trainer|Energy|Sideboard|Maybeboard)\s*:\s*\d*$/i;

export function detectFormat(text: string): DeckListFormat {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (SECTION_HEADER_REGEX.test(line)) return 'limitless';
    if (MOXFIELD_LINE_REGEX.test(line)) return 'moxfield';
    if (LIMITLESS_LINE_REGEX.test(line)) return 'limitless';
  }

  return 'moxfield';
}

function isSectionHeader(line: string): boolean {
  return SECTION_HEADER_REGEX.test(line);
}

export function parseDeckListLine(
  raw: string,
  lineNumber: number,
  format: DeckListFormat
): IDeckListLine {
  const trimmed = raw.trim();

  if (!trimmed) {
    return {
      lineNumber,
      raw,
      quantity: 0,
      cardName: '',
      setCode: '',
      collectorNumber: '',
      isValid: false,
      error: 'Línea vacía',
    };
  }

  if (isSectionHeader(trimmed)) {
    return {
      lineNumber,
      raw: trimmed,
      quantity: 0,
      cardName: '',
      setCode: '',
      collectorNumber: '',
      isValid: false,
      error: 'Encabezado de sección',
    };
  }

  const regex = format === 'moxfield' ? MOXFIELD_LINE_REGEX : LIMITLESS_LINE_REGEX;
  const match = trimmed.match(regex);

  if (!match) {
    const expectedFormat =
      format === 'moxfield'
        ? '[cantidad] [nombre] ([set]) [número]'
        : '[cantidad] [nombre] [set] [número]';

    return {
      lineNumber,
      raw: trimmed,
      quantity: 0,
      cardName: trimmed,
      setCode: '',
      collectorNumber: '',
      isValid: false,
      error: `Formato inválido. Esperado: ${expectedFormat}`,
    };
  }

  const quantity = parseInt(match[1], 10);

  if (quantity <= 0) {
    return {
      lineNumber,
      raw: trimmed,
      quantity,
      cardName: match[2],
      setCode: match[3].toUpperCase(),
      collectorNumber: match[4],
      isValid: false,
      error: 'La cantidad debe ser mayor a 0',
    };
  }

  return {
    lineNumber,
    raw: trimmed,
    quantity,
    cardName: match[2],
    setCode: match[3].toUpperCase(),
    collectorNumber: match[4],
    isValid: true,
  };
}

export function parseDeckListText(text: string): IDeckListLine[] {
  const format = detectFormat(text);

  return text
    .split('\n')
    .map((line, index) => parseDeckListLine(line, index + 1, format))
    .filter((line) => line.error !== 'Línea vacía' && line.error !== 'Encabezado de sección');
}

export function resolveCardsFromCatalog(
  parsedLines: IDeckListLine[],
  catalog: ICard[]
): IDeckListResolvedLine[] {
  return parsedLines.map((line) => {
    if (!line.isValid) {
      return { ...line, card: null, found: false };
    }

    const card = catalog.find(
      (c) =>
        c.name.toLowerCase() === line.cardName.toLowerCase() &&
        c.setCode.toUpperCase() === line.setCode.toUpperCase() &&
        c.number === line.collectorNumber
    );

    return {
      ...line,
      card: card ?? null,
      found: !!card,
    };
  });
}

export function buildImportResult(
  resolvedLines: IDeckListResolvedLine[]
): IDeckListImportResult {
  const validLines = resolvedLines.filter((l) => l.isValid);
  const invalidCount = resolvedLines.filter((l) => !l.isValid).length;
  const foundLines = validLines.filter((l) => l.found);
  const missingLines = validLines.filter((l) => !l.found);

  return {
    lines: resolvedLines,
    totalCards: resolvedLines.length,
    totalQuantity: validLines.reduce((sum, l) => sum + l.quantity, 0),
    foundCount: foundLines.length,
    missingCount: missingLines.length,
    invalidCount,
  };
}
