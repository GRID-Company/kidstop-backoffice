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
  QUAD_EXPAND_FACTOR,
  QUAD_ASPECT_RANGE,
} from '../../domain/constants';
import {
  orderCorners,
  expandCorners,
  warpPerspectiveNormalized,
} from '../../domain/card-scanner.domain';
import {
  calculateCaptureQuality,
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
import { createEmptyExtractedData } from '../../domain/parsers/common-parser.domain';
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
    let warpedMat: OpenCVMat | null = null;

    try {
      setStatus('capturing');
      setError(null);

      const orderedCorners: ICardCorners = orderCorners(corners);
      const contourDetectionTime = performance.now();
      metricsData.contourDetectionMs = contourDetectionTime - startTime;

      const quadWidth = Math.max(
        Math.hypot(
          orderedCorners.topRight.x - orderedCorners.topLeft.x,
          orderedCorners.topRight.y - orderedCorners.topLeft.y
        ),
        Math.hypot(
          orderedCorners.bottomRight.x - orderedCorners.bottomLeft.x,
          orderedCorners.bottomRight.y - orderedCorners.bottomLeft.y
        )
      );
      const quadHeight = Math.max(
        Math.hypot(
          orderedCorners.bottomLeft.x - orderedCorners.topLeft.x,
          orderedCorners.bottomLeft.y - orderedCorners.topLeft.y
        ),
        Math.hypot(
          orderedCorners.bottomRight.x - orderedCorners.topRight.x,
          orderedCorners.bottomRight.y - orderedCorners.topRight.y
        )
      );

      const measuredAspect =
        Math.min(quadWidth, quadHeight) > 0
          ? Math.max(quadWidth, quadHeight) / Math.min(quadWidth, quadHeight)
          : 0;

      if (
        measuredAspect < QUAD_ASPECT_RANGE.min ||
        measuredAspect > QUAD_ASPECT_RANGE.max
      ) {
        throw new Error(
          `Forma de carta no válida (ratio ${measuredAspect.toFixed(2)}). Encuadra la carta dentro de la guía.`
        );
      }

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

      const paddedCorners = expandCorners(orderedCorners, QUAD_EXPAND_FACTOR);
      warpedMat = warpPerspectiveNormalized(frameMat, paddedCorners, cv);
      const perspectiveTime = performance.now();
      metricsData.perspectiveTransformMs =
        perspectiveTime - contourDetectionTime;

      const isLandscape = quadWidth / quadHeight > 1.15;

      normalizedMat = isLandscape ? rotateCard(warpedMat, 90, cv) : warpedMat;

      if (isLandscape) {
        warpedMat.delete();
        warpedMat = null;
      }

      const normalizedImageUrl = matToDataURL(
        normalizedMat,
        cv,
        'image/jpeg',
        0.9
      );

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
          setIconImageUrl = matToDataURL(setIconMat, cv, 'image/jpeg', 0.9);
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
        if (
          warpedMat &&
          warpedMat !== normalizedMat &&
          !warpedMat.isDeleted()
        ) {
          warpedMat.delete();
        }
      } catch (cleanupErr) {
        console.warn('Error limpiando warpedMat:', cleanupErr);
      }

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

  const processRawCapture = async (video: HTMLVideoElement): Promise<void> => {
    const startTime = performance.now();

    try {
      setStatus('capturing');
      setError(null);

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error('Video no disponible');
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo capturar el frame del video');
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const rawImageUrl = canvas.toDataURL('image/jpeg', 0.9);

      const cardData: IScannedCardData = {
        imageDataUrl: rawImageUrl,
        normalizedImageUrl: rawImageUrl,
        setIconImageUrl: null,
        extractedData: createEmptyExtractedData(),
        confidence: {
          captureQuality: 0,
          ocrQuality: 0,
          extractionQuality: 0,
          overall: 0,
        },
        rawOcr: { fullText: '', regions: {} },
        detectedAt: new Date(),
        metrics: {
          contourDetectionMs: 0,
          perspectiveTransformMs: 0,
          regionExtractionMs: 0,
          ocrRequestMs: 0,
          parsingMs: 0,
          totalMs: performance.now() - startTime,
        },
      };

      setScannedData(cardData);
      setMetrics(cardData.metrics ?? null);
      setStatus('results');
    } catch (err) {
      console.error('Error en captura cruda:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setStatus('error');
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
    processRawCapture,
    updateExtractedData,
    reset,
  };
};
