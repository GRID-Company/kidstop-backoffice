import { ICompositeRegionMap, IRegionalOcrResult } from '../../domain/types';
import { classifyTokensByRegion } from '../../domain/region-extraction.domain';
import { fetchWithTimeout } from '@/lib/utils/fetch-with-timeout';
import { retryWithBackoff } from '@/lib/utils/retry-with-backoff';
import { visionApiRateLimiter } from '@/lib/utils/rate-limiter';
import { logger } from '../../domain/logger';

export interface VisionOCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    boundingBox: Array<{ x: number; y: number }>;
  }>;
}

export async function extractTextWithVision(
  imageDataUrl: string
): Promise<VisionOCRResult> {
  logger.debug('🚀 Llamando a Google Vision API...');

  return visionApiRateLimiter.execute(async () => {
    return retryWithBackoff(
      async () => {
        const response = await fetchWithTimeout('/api/ocr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageDataUrl }),
          timeout: 30000,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            `Vision API error: ${error.error || response.statusText}`
          );
        }

        const result = await response.json();

        logger.debug(
          `✅ Texto extraído con ${(result.confidence * 100).toFixed(1)}% de confianza`
        );

        return result;
      },
      {
        maxRetries: 3,
        initialDelayMs: 1000,
        retryableStatusCodes: [408, 429, 500, 502, 503, 504],
      }
    );
  });
}

export function parseVisionResponse(
  visionResult: VisionOCRResult,
  regionMap: ICompositeRegionMap[]
): IRegionalOcrResult {
  const wordsWithBoundingBox = visionResult.words.filter(
    (word) => word.boundingBox && word.boundingBox.length > 0
  );

  return classifyTokensByRegion(wordsWithBoundingBox, regionMap);
}

export async function extractTextWithVisionRegional(
  imageDataUrl: string,
  regionMap: ICompositeRegionMap[]
): Promise<IRegionalOcrResult> {
  const visionResult = await extractTextWithVision(imageDataUrl);
  return parseVisionResponse(visionResult, regionMap);
}
