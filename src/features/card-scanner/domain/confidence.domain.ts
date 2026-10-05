import {
  IExtractedCardData,
  IRegionalOcrResult,
  IScanConfidence,
  TCGGame,
} from './types';
import { EXTRACTION_WEIGHTS, QUALITY_THRESHOLDS } from './constants';

export function calculateOcrQuality(regionalOcr: IRegionalOcrResult): number {
  const regionConfidences: number[] = [];
  const regionWeights: Record<string, number> = {
    name: 0.35,
    hp: 0.15,
    footer: 0.35,
    setSymbol: 0.15,
  };

  let totalWeight = 0;
  let weightedSum = 0;

  for (const regionId in regionalOcr.regions) {
    const region = regionalOcr.regions[regionId];
    if (region.averageConfidence !== null) {
      const weight = regionWeights[regionId] || 0.1;
      weightedSum += region.averageConfidence * weight;
      totalWeight += weight;
      regionConfidences.push(region.averageConfidence);
    }
  }

  if (totalWeight === 0 || regionConfidences.length === 0) {
    return 0;
  }

  const weightedAverage = weightedSum / totalWeight;

  const hasText = regionalOcr.fullText.length > 10;
  const textLengthBonus = hasText ? 0.05 : 0;

  const hasMultipleRegions = regionConfidences.length >= 3;
  const regionBonus = hasMultipleRegions ? 0.05 : 0;

  const quality = Math.min(1, weightedAverage + textLengthBonus + regionBonus);

  return quality;
}

export function calculateExtractionQuality(
  extractedData: IExtractedCardData,
  game: TCGGame
): number {
  const weights = EXTRACTION_WEIGHTS[game];

  let totalWeight = 0;
  let weightedScore = 0;
  let fieldsFound = 0;

  const baseFields: Array<{ field: keyof IExtractedCardData; weight: number }> =
    [
      { field: 'collectorNumber', weight: weights.collectorNumber },
      { field: 'name', weight: weights.name },
      { field: 'setCode', weight: weights.setCode },
      { field: 'rarity', weight: weights.rarity },
    ];

  if (game === 'pokemon' && 'hp' in weights) {
    baseFields.push({ field: 'hp', weight: weights.hp });
  }

  for (const { field, weight } of baseFields) {
    const fieldData = extractedData[field];
    totalWeight += weight;

    if (fieldData.value !== null) {
      weightedScore += fieldData.confidence * weight;
      fieldsFound++;
    }
  }

  if (totalWeight === 0) {
    return 0;
  }

  const baseQuality = weightedScore / totalWeight;

  const criticalFieldsFound =
    extractedData.name.value !== null &&
    extractedData.collectorNumber.value !== null;
  const criticalBonus = criticalFieldsFound ? 0.1 : 0;

  const fieldCoverageRatio = fieldsFound / baseFields.length;
  const coverageBonus = fieldCoverageRatio >= 0.6 ? 0.05 : 0;

  const quality = Math.min(1, baseQuality + criticalBonus + coverageBonus);

  return quality;
}

export function calculateOverallConfidence(
  captureQuality: number,
  ocrQuality: number,
  extractionQuality: number
): IScanConfidence {
  const overall =
    captureQuality * 0.4 + ocrQuality * 0.4 + extractionQuality * 0.2;

  return {
    captureQuality,
    ocrQuality,
    extractionQuality,
    overall,
  };
}

export function isQualityAcceptable(confidence: IScanConfidence): boolean {
  return (
    confidence.captureQuality >= QUALITY_THRESHOLDS.MINIMUM_CAPTURE &&
    confidence.ocrQuality >= QUALITY_THRESHOLDS.MINIMUM_OCR &&
    confidence.overall >= QUALITY_THRESHOLDS.MINIMUM_OVERALL
  );
}

export function getQualityLevel(
  quality: number
): 'excellent' | 'good' | 'acceptable' | 'poor' {
  if (quality >= 0.8) return 'excellent';
  if (quality >= 0.6) return 'good';
  if (quality >= 0.4) return 'acceptable';
  return 'poor';
}

export function getQualityFeedback(confidence: IScanConfidence): string[] {
  const feedback: string[] = [];

  if (confidence.captureQuality < QUALITY_THRESHOLDS.GOOD_CAPTURE) {
    if (confidence.captureQuality < QUALITY_THRESHOLDS.MINIMUM_CAPTURE) {
      feedback.push(
        '⚠️ Calidad de captura muy baja. Mejora la iluminación y enfoque.'
      );
    } else {
      feedback.push('💡 Mejora la calidad de captura acercando más la carta.');
    }
  }

  if (confidence.ocrQuality < QUALITY_THRESHOLDS.GOOD_OCR) {
    if (confidence.ocrQuality < QUALITY_THRESHOLDS.MINIMUM_OCR) {
      feedback.push(
        '⚠️ Texto no legible. Asegúrate de que la carta esté enfocada.'
      );
    } else {
      feedback.push(
        '💡 Texto parcialmente legible. Intenta mejorar la iluminación.'
      );
    }
  }

  if (confidence.extractionQuality < QUALITY_THRESHOLDS.GOOD_EXTRACTION) {
    if (confidence.extractionQuality < QUALITY_THRESHOLDS.MINIMUM_EXTRACTION) {
      feedback.push(
        '⚠️ No se pudieron extraer datos. Verifica que sea una carta TCG.'
      );
    } else {
      feedback.push(
        '💡 Algunos datos no se detectaron. Intenta capturar de nuevo.'
      );
    }
  }

  if (confidence.overall >= QUALITY_THRESHOLDS.EXCELLENT_CAPTURE) {
    feedback.push('✅ Excelente calidad de escaneo!');
  } else if (confidence.overall >= QUALITY_THRESHOLDS.GOOD_CAPTURE) {
    feedback.push('✅ Buena calidad de escaneo.');
  }

  return feedback;
}

export function formatConfidencePercentage(quality: number): string {
  return `${(quality * 100).toFixed(0)}%`;
}
