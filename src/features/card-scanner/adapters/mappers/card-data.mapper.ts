import { RecognizeResult } from 'tesseract.js';
import {
  ICardCorners,
  IExtractedCardData,
  IPoint,
  IRegionalOcrResult,
  IScanConfidence,
  IScannedCardData,
} from '../../domain/types';

export function mapCornersToOrdered(corners: number[]): ICardCorners {
  const pts: IPoint[] = [
    { x: corners[0], y: corners[1] },
    { x: corners[2], y: corners[3] },
    { x: corners[4], y: corners[5] },
    { x: corners[6], y: corners[7] },
  ];

  pts.sort((a, b) => a.x + a.y - (b.x + b.y));
  const topLeft = pts[0];
  const bottomRight = pts[3];

  const remaining = [pts[1], pts[2]];
  remaining.sort((a, b) => a.y - a.x - (b.y - b.x));
  const topRight = remaining[0];
  const bottomLeft = remaining[1];

  return {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
  };
}

function createEmptyExtractedField<T = string>() {
  return {
    value: null as T | null,
    normalizedValue: null as T | null,
    confidence: 0,
    sourceRegions: [],
    rawMatches: [],
  };
}

function createEmptyExtractedCardData(): IExtractedCardData {
  return {
    name: createEmptyExtractedField(),
    collectorNumber: createEmptyExtractedField(),
    printedTotal: createEmptyExtractedField(),
    setCode: createEmptyExtractedField(),
    setSymbol: createEmptyExtractedField(),
    hp: createEmptyExtractedField<number>(),
    rarity: createEmptyExtractedField(),
    language: createEmptyExtractedField(),
    printedYear: createEmptyExtractedField<number>(),
  };
}

export function mapOCRResultToCardData(
  result: RecognizeResult,
  imageDataUrl: string
): IScannedCardData {
  const confidence: IScanConfidence = {
    captureQuality: 0.8,
    ocrQuality: result.data.confidence / 100,
    extractionQuality: 0,
    overall: result.data.confidence / 100,
  };

  const rawOcr: IRegionalOcrResult = {
    fullText: result.data.text,
    regions: {},
  };

  return {
    imageDataUrl,
    normalizedImageUrl: imageDataUrl,
    extractedData: createEmptyExtractedCardData(),
    confidence,
    rawOcr,
    detectedAt: new Date(),
  };
}
