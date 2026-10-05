import { useState } from 'react';
import {
  OpenCV,
  OpenCVMat,
  IRegionalOcrResult,
  IScannerMetrics,
  ScannerStatus,
  IScannedCardData,
  IExtractedCardData,
  TCGGame,
  ICardCorners,
} from '../../domain/types';
import {
  CARD_REGION_CONFIGS,
  QUALITY_THRESHOLDS,
} from '../../domain/constants';
import {
  orderCorners,
  warpPerspectiveNormalized,
} from '../../domain/card-scanner.domain';
import {
  calculateCaptureQuality,
  detectOrientation,
  rotateCard,
} from '../../domain/normalization.domain';
import {
  createCompositeOcrImage,
  extractRegion,
  matToDataURL,
} from '../../domain/region-extraction.domain';
import { extractTextWithVisionRegional } from '../../adapters/ocr/google-vision';
import { parsePokemonCard } from '../../domain/parsers/pokemon-parser.domain';
import { parseMagicCard } from '../../domain/parsers/magic-parser.domain';
import {
  calculateOcrQuality,
  calculateExtractionQuality,
  calculateOverallConfidence,
  isQualityAcceptable,
  getQualityFeedback,
} from '../../domain/confidence.domain';

export const useCardScannerPipeline = (game: TCGGame) => {
  const [status, setStatus] = useState<ScannerStatus>('camera-ready');
  const [scannedData, setScannedData] = useState<IScannedCardData | null>(null);
  const [metrics, setMetrics] = useState<IScannerMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qualityFeedback, setQualityFeedback] = useState<string[]>([]);

  const processCard = async (
    frameMat: OpenCVMat,
    corners: number[],
    cv: OpenCV,
    frameSize: { width: number; height: number }
  ): Promise<void> => {
    const startTime = performance.now();
    const metricsData: Partial<IScannerMetrics> = {};
    let normalizedMat: OpenCVMat | null = null;
    let compositeMat: OpenCVMat | null = null;

    try {
      setStatus('capturing');
      setError(null);

      const orderedCorners: ICardCorners = orderCorners(corners);
      const contourDetectionTime = performance.now();
      metricsData.contourDetectionMs = contourDetectionTime - startTime;

      const captureQuality = calculateCaptureQuality(
        frameMat,
        orderedCorners,
        frameSize,
        cv
      );

      if (captureQuality < QUALITY_THRESHOLDS.MINIMUM_CAPTURE) {
        throw new Error(
          `Calidad de captura insuficiente (${(captureQuality * 100).toFixed(0)}%). Mejora la iluminación y enfoque.`
        );
      }

      setStatus('processing-image');

      const warpedMat = warpPerspectiveNormalized(frameMat, orderedCorners, cv);
      const perspectiveTime = performance.now();
      metricsData.perspectiveTransformMs =
        perspectiveTime - contourDetectionTime;

      const orientation = detectOrientation(warpedMat, cv);
      normalizedMat =
        orientation !== 0 ? rotateCard(warpedMat, orientation, cv) : warpedMat;

      if (orientation !== 0) {
        warpedMat.delete();
      }

      const normalizedImageUrl = matToDataURL(normalizedMat, cv);

      const regionConfig = CARD_REGION_CONFIGS[`${game}-default`];
      if (!regionConfig) {
        throw new Error(`No region config found for game: ${game}`);
      }

      const setSymbolRegion = regionConfig.regions.find(
        (region) => region.id === 'setSymbol'
      );
      let setIconImageUrl: string | null = null;
      if (setSymbolRegion) {
        const setIconMat = extractRegion(normalizedMat, setSymbolRegion, cv);
        if (!setIconMat.empty()) {
          setIconImageUrl = matToDataURL(setIconMat, cv);
        }
        setIconMat.delete();
      }

      const compositeResult = createCompositeOcrImage(
        normalizedMat,
        regionConfig.regions,
        cv
      );
      compositeMat = compositeResult.compositeMat;
      const regionMap = compositeResult.regionMap;

      const regionExtractionTime = performance.now();
      metricsData.regionExtractionMs = regionExtractionTime - perspectiveTime;

      if (compositeMat.empty()) {
        throw new Error('Failed to create composite OCR image');
      }

      const compositeImageUrl = matToDataURL(compositeMat, cv);

      setStatus('extracting-text');

      const regionalOcr: IRegionalOcrResult =
        await extractTextWithVisionRegional(compositeImageUrl, regionMap);

      const ocrTime = performance.now();
      metricsData.ocrRequestMs = ocrTime - regionExtractionTime;

      const ocrQuality = calculateOcrQuality(regionalOcr);

      if (ocrQuality < QUALITY_THRESHOLDS.MINIMUM_OCR) {
        throw new Error(
          `Calidad de OCR insuficiente (${(ocrQuality * 100).toFixed(0)}%). El texto no es legible.`
        );
      }

      const extractedData =
        game === 'pokemon'
          ? parsePokemonCard(regionalOcr)
          : game === 'magic'
            ? parseMagicCard(regionalOcr)
            : parsePokemonCard(regionalOcr);

      const parsingTime = performance.now();
      metricsData.parsingMs = parsingTime - ocrTime;
      metricsData.backendSearchMs = 0;

      const extractionQuality = calculateExtractionQuality(extractedData, game);

      const confidence = calculateOverallConfidence(
        captureQuality,
        ocrQuality,
        extractionQuality
      );

      if (!isQualityAcceptable(confidence)) {
        console.warn(
          '⚠️ Calidad general por debajo del umbral mínimo:',
          confidence
        );
      }

      const totalTime = performance.now();
      metricsData.totalMs = totalTime - startTime;

      const feedback = getQualityFeedback(confidence);
      setQualityFeedback(feedback);

      const cardData: IScannedCardData = {
        imageDataUrl: compositeImageUrl,
        normalizedImageUrl,
        setIconImageUrl,
        extractedData,
        confidence,
        rawOcr: regionalOcr,
        detectedAt: new Date(),
        metrics: metricsData as IScannerMetrics,
      };

      setScannedData(cardData);
      setMetrics(metricsData as IScannerMetrics);
      setStatus('results');

      compositeMat.delete();
      normalizedMat.delete();
    } catch (err) {
      console.error('Error en pipeline de escaneo:', err);

      let errorMessage = 'Error desconocido';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      setStatus('error');

      try {
        if (normalizedMat && !normalizedMat.isDeleted()) {
          normalizedMat.delete();
        }
      } catch (cleanupErr) {
        console.warn('Error limpiando normalizedMat:', cleanupErr);
      }

      try {
        if (compositeMat && !compositeMat.isDeleted()) {
          compositeMat.delete();
        }
      } catch (cleanupErr) {
        console.warn('Error limpiando compositeMat:', cleanupErr);
      }
    }
  };

  const updateExtractedData = (updatedData: IExtractedCardData) => {
    setScannedData((prev) =>
      prev ? { ...prev, extractedData: updatedData } : prev
    );
  };

  const reset = () => {
    setScannedData(null);
    setMetrics(null);
    setError(null);
    setQualityFeedback([]);
    setStatus('camera-ready');
  };

  return {
    status,
    scannedData,
    metrics,
    error,
    qualityFeedback,
    processCard,
    updateExtractedData,
    reset,
  };
};
