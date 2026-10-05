import { useState } from 'react';
import { extractTextWithVision } from '../../adapters/ocr/google-vision';
import {
  IExtractedCardData,
  IRegionalOcrResult,
  IScanConfidence,
  IScannedCardData,
} from '../../domain/types';

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

export const useOCRExtraction = () => {
  const [scannedData, setScannedData] = useState<IScannedCardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractText = async (imageDataUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await extractTextWithVision(imageDataUrl);

      const confidence: IScanConfidence = {
        captureQuality: 0.8,
        ocrQuality: result.confidence,
        extractionQuality: 0,
        overall: result.confidence * 0.8,
      };

      const rawOcr: IRegionalOcrResult = {
        fullText: result.text,
        regions: {},
      };

      const cardData: IScannedCardData = {
        imageDataUrl,
        normalizedImageUrl: imageDataUrl,
        setIconImageUrl: null,
        extractedData: createEmptyExtractedCardData(),
        confidence,
        rawOcr,
        detectedAt: new Date(),
      };

      setScannedData(cardData);
    } catch (err) {
      console.error('Error extrayendo texto:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error desconocido al extraer texto'
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setScannedData(null);
    setError(null);
  };

  return {
    scannedData,
    loading,
    error,
    extractText,
    reset,
  };
};
