import {
  ICompositeRegionMap,
  INormalizedRegion,
  IOcrToken,
  OpenCV,
  OpenCVMat,
  IRegionalOcrResult,
} from './types';
import { COMPOSITE_IMAGE_CONFIG } from './constants';

/**
 * Extrae una región específica de una imagen normalizada
 *
 * @param normalizedMat - Matriz de imagen normalizada (NO se modifica, NO se libera)
 * @param region - Configuración de la región a extraer (coordenadas normalizadas 0-1)
 * @param cv - Instancia OpenCV
 * @returns Nueva matriz con la región extraída (DEBE liberarse con .delete())
 * @throws Error si normalizedMat es null, undefined o vacío
 * @throws Error si region es null o undefined
 * @throws Error si cv no está inicializado
 */
export function extractRegion(
  normalizedMat: OpenCVMat,
  region: INormalizedRegion,
  cv: OpenCV
): OpenCVMat {
  if (!normalizedMat) {
    throw new Error('extractRegion: normalizedMat cannot be null or undefined');
  }
  if (normalizedMat.empty?.()) {
    throw new Error('extractRegion: normalizedMat cannot be empty');
  }
  if (!region) {
    throw new Error('extractRegion: region cannot be null or undefined');
  }
  if (!cv) {
    throw new Error('extractRegion: OpenCV instance is required');
  }

  const cardWidth = normalizedMat.cols;
  const cardHeight = normalizedMat.rows;

  const x = Math.floor(region.x * cardWidth);
  const y = Math.floor(region.y * cardHeight);
  const width = Math.floor(region.width * cardWidth);
  const height = Math.floor(region.height * cardHeight);

  const clampedX = Math.max(0, Math.min(x, cardWidth - 1));
  const clampedY = Math.max(0, Math.min(y, cardHeight - 1));
  const clampedWidth = Math.min(width, cardWidth - clampedX);
  const clampedHeight = Math.min(height, cardHeight - clampedY);

  if (clampedWidth <= 0 || clampedHeight <= 0) {
    return new cv.Mat();
  }

  const rect = new cv.Rect(clampedX, clampedY, clampedWidth, clampedHeight);
  const regionMat = normalizedMat.roi(rect);

  return regionMat.clone();
}

export function createCompositeOcrImage(
  normalizedMat: OpenCVMat,
  regions: INormalizedRegion[],
  cv: OpenCV
): {
  compositeMat: OpenCVMat;
  regionMap: ICompositeRegionMap[];
} {
  const { regionScale, regionSpacing, backgroundColor } =
    COMPOSITE_IMAGE_CONFIG;

  const extractedRegions: Array<{
    id: string;
    mat: OpenCVMat;
    scaledMat: OpenCVMat;
  }> = [];

  let totalHeight = 0;
  let maxWidth = 0;

  for (const region of regions) {
    const regionMat = extractRegion(normalizedMat, region, cv);

    if (regionMat.empty()) {
      continue;
    }

    const scaledMat = new cv.Mat();
    const scaledWidth = regionMat.cols * regionScale;
    const scaledHeight = regionMat.rows * regionScale;
    const dsize = new cv.Size(scaledWidth, scaledHeight);

    cv.resize(regionMat, scaledMat, dsize, 0, 0, cv.INTER_CUBIC);

    extractedRegions.push({
      id: region.id,
      mat: regionMat,
      scaledMat,
    });

    totalHeight += scaledHeight + regionSpacing;
    maxWidth = Math.max(maxWidth, scaledWidth);
  }

  if (extractedRegions.length === 0) {
    return {
      compositeMat: new cv.Mat(),
      regionMap: [],
    };
  }

  totalHeight = Math.max(totalHeight - regionSpacing, 0);

  const compositeMat = new cv.Mat(
    totalHeight,
    maxWidth,
    cv.CV_8UC3,
    new cv.Scalar(...backgroundColor)
  );

  const regionMap: ICompositeRegionMap[] = [];
  let currentY = 0;

  for (const { id, scaledMat } of extractedRegions) {
    const height = scaledMat.rows;
    const width = scaledMat.cols;

    const roi = compositeMat.roi(new cv.Rect(0, currentY, width, height));

    if (scaledMat.channels() === 4) {
      const rgb = new cv.Mat();
      cv.cvtColor(scaledMat, rgb, cv.COLOR_RGBA2RGB);
      rgb.copyTo(roi);
      rgb.delete();
    } else if (scaledMat.channels() === 1) {
      const rgb = new cv.Mat();
      cv.cvtColor(scaledMat, rgb, cv.COLOR_GRAY2RGB);
      rgb.copyTo(roi);
      rgb.delete();
    } else {
      scaledMat.copyTo(roi);
    }

    regionMap.push({
      regionId: id,
      top: currentY,
      bottom: currentY + height,
      left: 0,
      right: width,
    });

    currentY += height + regionSpacing;
    roi.delete();
  }

  for (const { mat, scaledMat } of extractedRegions) {
    mat.delete();
    scaledMat.delete();
  }

  return {
    compositeMat,
    regionMap,
  };
}

export function classifyTokensByRegion(
  words: Array<{
    text: string;
    confidence: number;
    boundingBox: Array<{ x: number; y: number }>;
  }>,
  regionMap: ICompositeRegionMap[]
): IRegionalOcrResult {
  const tokens: IOcrToken[] = [];
  const regionTexts: Record<string, string[]> = {};
  const regionTokens: Record<string, IOcrToken[]> = {};
  const regionConfidences: Record<string, number[]> = {};

  for (const region of regionMap) {
    regionTexts[region.regionId] = [];
    regionTokens[region.regionId] = [];
    regionConfidences[region.regionId] = [];
  }

  for (const word of words) {
    if (!word.boundingBox || word.boundingBox.length === 0) {
      continue;
    }

    const centerX =
      word.boundingBox.reduce((sum, point) => sum + point.x, 0) /
      word.boundingBox.length;
    const centerY =
      word.boundingBox.reduce((sum, point) => sum + point.y, 0) /
      word.boundingBox.length;

    let assignedRegion: string | null = null;

    for (const region of regionMap) {
      if (
        centerX >= region.left &&
        centerX <= region.right &&
        centerY >= region.top &&
        centerY <= region.bottom
      ) {
        assignedRegion = region.regionId;
        break;
      }
    }

    const token: IOcrToken = {
      text: word.text,
      confidence: word.confidence,
      centerX,
      centerY,
      regionId: assignedRegion,
    };

    tokens.push(token);

    if (assignedRegion) {
      regionTexts[assignedRegion].push(word.text);
      regionTokens[assignedRegion].push(token);
      regionConfidences[assignedRegion].push(word.confidence);
    }
  }

  const fullText = tokens.map((t) => t.text).join(' ');

  const regions: IRegionalOcrResult['regions'] = {};

  for (const regionId of Object.keys(regionTexts)) {
    const text = regionTexts[regionId].join(' ');
    const confidences = regionConfidences[regionId];
    const averageConfidence =
      confidences.length > 0
        ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length
        : null;

    regions[regionId] = {
      text,
      tokens: regionTokens[regionId],
      averageConfidence,
    };
  }

  return {
    fullText,
    regions,
  };
}

export function matToDataURL(mat: OpenCVMat, cv: OpenCV): string {
  const canvas = document.createElement('canvas');
  canvas.width = mat.cols;
  canvas.height = mat.rows;

  cv.imshow(canvas, mat);

  return canvas.toDataURL('image/png');
}

export function scaleRegionForOCR(
  regionMat: OpenCVMat,
  cv: OpenCV,
  scale: number = 2
): OpenCVMat {
  const scaled = new cv.Mat();
  const dsize = new cv.Size(regionMat.cols * scale, regionMat.rows * scale);

  cv.resize(regionMat, scaled, dsize, 0, 0, cv.INTER_CUBIC);

  return scaled;
}
