import {
  ICardCorners,
  OpenCV,
  OpenCVMat,
  IPoint,
  IGuideRegion,
  IDetectionResult,
} from './types';
import {
  CARD_DIMENSIONS,
  DETECTION_PARAMS,
  NORMALIZED_CARD_DIMENSIONS,
} from './constants';
import { logger } from './logger';

function preprocessForContours(src: OpenCVMat, cv: OpenCV): OpenCVMat {
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();

  if (src.channels() === 4) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else if (src.channels() === 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  } else {
    src.copyTo(gray);
  }

  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
  cv.Canny(blurred, edges, 50, 150);

  gray.delete();
  blurred.delete();

  return edges;
}

function detectCardContours(src: OpenCVMat, cv: OpenCV): IDetectionResult {
  const edges = preprocessForContours(src, cv);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_TREE,
      cv.CHAIN_APPROX_SIMPLE
    );

    const frameArea = src.rows * src.cols;
    const minArea = frameArea * DETECTION_PARAMS.minAreaRatio;
    const maxArea = frameArea * DETECTION_PARAMS.maxAreaRatio;

    const candidates: Array<{
      corners: number[];
      area: number;
      aspectRatio: number;
      hasParent: boolean;
    }> = [];

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);

      if (area < minArea || area > maxArea) continue;

      const hasParent = hierarchy.data32S
        ? hierarchy.data32S[i * 4 + 3] !== -1
        : false;

      const peri = cv.arcLength(cnt, true);
      const approx = new cv.Mat();
      cv.approxPolyDP(cnt, approx, DETECTION_PARAMS.approxEpsilon * peri, true);

      let vertices = approx.rows;
      let finalApprox = approx;

      if (vertices >= 5 && vertices <= 20) {
        const aggressiveApprox = new cv.Mat();
        cv.approxPolyDP(cnt, aggressiveApprox, 0.04 * peri, true);

        if (aggressiveApprox.rows === 4) {
          finalApprox = aggressiveApprox;
          vertices = 4;
          approx.delete();
        } else {
          aggressiveApprox.delete();
        }
      }

      if (vertices === 4) {
        const rect = cv.boundingRect(finalApprox);
        const aspectRatio = rect.width / rect.height;

        const isCardAspectRatio =
          (aspectRatio >= DETECTION_PARAMS.minAspectRatioPortrait &&
            aspectRatio <= DETECTION_PARAMS.maxAspectRatioPortrait) ||
          (aspectRatio >= DETECTION_PARAMS.minAspectRatioLandscape &&
            aspectRatio <= DETECTION_PARAMS.maxAspectRatioLandscape);

        if (
          isCardAspectRatio &&
          finalApprox.data32S &&
          finalApprox.data32S.length >= 8
        ) {
          candidates.push({
            corners: [
              finalApprox.data32S[0],
              finalApprox.data32S[1],
              finalApprox.data32S[2],
              finalApprox.data32S[3],
              finalApprox.data32S[4],
              finalApprox.data32S[5],
              finalApprox.data32S[6],
              finalApprox.data32S[7],
            ],
            area,
            aspectRatio,
            hasParent,
          });
        }
      }

      finalApprox.delete();
    }

    candidates.sort((a, b) => {
      if (a.hasParent !== b.hasParent) {
        return a.hasParent ? 1 : -1;
      }
      return b.area - a.area;
    });

    if (candidates.length > 0) {
      const best = candidates[0];
      logger.debug(
        `✅ Detectado! Área: ${Math.round(best.area)}, AR: ${best.aspectRatio.toFixed(2)}, HasParent: ${best.hasParent}`
      );
      return { corners: best.corners, found: true, method: 'contours' };
    }

    return { corners: [], found: false, method: 'none' };
  } finally {
    edges.delete();
    contours.delete();
    hierarchy.delete();
  }
}

function getROIFromGuide(frameWidth: number, frameHeight: number): number[] {
  const TCG_CARD_RATIO = 1.4;
  const GUIDE_WIDTH_PERCENTAGE = 65;

  const frameAspectRatio = frameWidth / frameHeight;

  let guideWidth: number, guideHeight: number, guideX: number, guideY: number;

  if (frameAspectRatio > 1) {
    guideHeight = 0.91;
    guideWidth = guideHeight / TCG_CARD_RATIO;
    guideX = (1 - guideWidth) / 2;
    guideY = 0.045;
  } else {
    guideWidth = GUIDE_WIDTH_PERCENTAGE / 100;
    guideHeight = guideWidth * TCG_CARD_RATIO;
    guideX = (1 - guideWidth) / 2;
    guideY = (1 - guideHeight) / 2;
  }

  const x1 = Math.round(guideX * frameWidth);
  const y1 = Math.round(guideY * frameHeight);
  const x2 = Math.round((guideX + guideWidth) * frameWidth);
  const y2 = y1;
  const x3 = x2;
  const y3 = Math.round((guideY + guideHeight) * frameHeight);
  const x4 = x1;
  const y4 = y3;

  return [x1, y1, x2, y2, x3, y3, x4, y4];
}

function _detectBySimpleThreshold(
  src: OpenCVMat,
  cv: OpenCV
): IDetectionResult {
  const gray = new cv.Mat();
  const thresh = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    if (src.channels() === 4) {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    } else if (src.channels() === 3) {
      cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
    } else {
      src.copyTo(gray);
    }

    cv.threshold(gray, thresh, 127, 255, cv.THRESH_BINARY);

    cv.findContours(
      thresh,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    const frameArea = src.rows * src.cols;
    const minArea = frameArea * 0.15;
    const maxArea = frameArea * 0.9;

    let maxCardArea = 0;
    let bestRect: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null = null;

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);

      if (area < minArea || area > maxArea) continue;

      const rect = cv.boundingRect(cnt);
      const aspectRatio = rect.width / rect.height;

      const isCardAspectRatio =
        (aspectRatio >= 0.55 && aspectRatio <= 0.85) ||
        (aspectRatio >= 1.18 && aspectRatio <= 1.82);

      if (isCardAspectRatio && area > maxCardArea) {
        maxCardArea = area;
        bestRect = rect;
      }
    }

    if (bestRect) {
      const corners = [
        bestRect.x,
        bestRect.y,
        bestRect.x + bestRect.width,
        bestRect.y,
        bestRect.x + bestRect.width,
        bestRect.y + bestRect.height,
        bestRect.x,
        bestRect.y + bestRect.height,
      ];

      logger.debug(
        `🟡 Detectado por threshold simple! Área: ${Math.round(maxCardArea)}`
      );
      return { corners, found: true, method: 'contours' };
    }

    return { corners: [], found: false, method: 'none' };
  } finally {
    gray.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
  }
}

export function detectCardContoursWithFallback(
  src: OpenCVMat,
  cv: OpenCV
): IDetectionResult {
  const edgeResult = detectCardContours(src, cv);

  if (edgeResult.found) {
    return edgeResult;
  }

  const roiCorners = getROIFromGuide(src.cols, src.rows);

  logger.debug(`🔄 Usando ROI de la guía como fallback`);

  return {
    corners: roiCorners,
    found: true,
    method: 'roi-fallback',
  };
}

export function orderCorners(corners: number[]): ICardCorners {
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

/**
 * Aplica transformación de perspectiva a una imagen usando las esquinas detectadas
 *
 * @param src - Matriz de imagen de entrada (NO se modifica, NO se libera)
 * @param corners - Esquinas de la carta detectadas
 * @param cv - Instancia OpenCV
 * @returns Nueva matriz con perspectiva corregida (DEBE liberarse con .delete())
 * @throws Error si src es null, undefined o vacío
 * @throws Error si cv no está inicializado
 * @throws Error si corners es null o undefined
 */
export function warpPerspective(
  src: OpenCVMat,
  corners: ICardCorners,
  cv: OpenCV
): OpenCVMat {
  if (!src) {
    throw new Error('warpPerspective: src cannot be null or undefined');
  }
  if (src.empty?.()) {
    throw new Error('warpPerspective: src cannot be empty');
  }
  if (!cv) {
    throw new Error('warpPerspective: OpenCV instance is required');
  }
  if (!corners) {
    throw new Error('warpPerspective: corners cannot be null or undefined');
  }

  const srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
    corners.topLeft.x,
    corners.topLeft.y,
    corners.topRight.x,
    corners.topRight.y,
    corners.bottomRight.x,
    corners.bottomRight.y,
    corners.bottomLeft.x,
    corners.bottomLeft.y,
  ]);

  const dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    CARD_DIMENSIONS.width,
    0,
    CARD_DIMENSIONS.width,
    CARD_DIMENSIONS.height,
    0,
    CARD_DIMENSIONS.height,
  ]);

  const dsize = new cv.Size(CARD_DIMENSIONS.width, CARD_DIMENSIONS.height);
  const resultMat = new cv.Mat();
  const M = cv.getPerspectiveTransform(srcCoords, dstCoords);

  try {
    cv.warpPerspective(
      src,
      resultMat,
      M,
      dsize,
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar()
    );

    return resultMat;
  } catch (error) {
    resultMat.delete();
    throw error;
  } finally {
    srcCoords.delete();
    dstCoords.delete();
    M.delete();
  }
}

export function warpPerspectiveNormalized(
  src: OpenCVMat,
  corners: ICardCorners,
  cv: OpenCV
): OpenCVMat {
  const srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
    corners.topLeft.x,
    corners.topLeft.y,
    corners.topRight.x,
    corners.topRight.y,
    corners.bottomRight.x,
    corners.bottomRight.y,
    corners.bottomLeft.x,
    corners.bottomLeft.y,
  ]);

  const dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    NORMALIZED_CARD_DIMENSIONS.width,
    0,
    NORMALIZED_CARD_DIMENSIONS.width,
    NORMALIZED_CARD_DIMENSIONS.height,
    0,
    NORMALIZED_CARD_DIMENSIONS.height,
  ]);

  const dsize = new cv.Size(
    NORMALIZED_CARD_DIMENSIONS.width,
    NORMALIZED_CARD_DIMENSIONS.height
  );
  const resultMat = new cv.Mat();
  const M = cv.getPerspectiveTransform(srcCoords, dstCoords);

  cv.warpPerspective(
    src,
    resultMat,
    M,
    dsize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  );

  srcCoords.delete();
  dstCoords.delete();
  M.delete();

  return resultMat;
}

function calculateGuideRegionForFrame(
  frameWidth: number,
  frameHeight: number
): IGuideRegion {
  const frameAspectRatio = frameWidth / frameHeight;
  const TCG_CARD_RATIO = 1.4;
  const GUIDE_WIDTH_PERCENTAGE = 0.65;

  const guideWidth = GUIDE_WIDTH_PERCENTAGE;
  const guideHeight = GUIDE_WIDTH_PERCENTAGE * TCG_CARD_RATIO;

  if (frameAspectRatio > 1) {
    const effectiveHeight = 1.0;
    const effectiveWidth = frameAspectRatio;

    return {
      x: (effectiveWidth - guideWidth) / 2 / effectiveWidth,
      y: (effectiveHeight - guideHeight) / 2 / effectiveHeight,
      width: guideWidth / effectiveWidth,
      height: guideHeight / effectiveHeight,
    };
  } else {
    const effectiveWidth = 1.0;
    const effectiveHeight = 1 / frameAspectRatio;

    return {
      x: (effectiveWidth - guideWidth) / 2 / effectiveWidth,
      y: (effectiveHeight - guideHeight) / 2 / effectiveHeight,
      width: guideWidth / effectiveWidth,
      height: guideHeight / effectiveHeight,
    };
  }
}

export function validateCardAlignment(
  corners: number[],
  frameWidth: number,
  frameHeight: number,
  guideRegion?: IGuideRegion,
  tolerance: number = 0.08
): { aligned: boolean; coverage: number; reason?: string } {
  const effectiveGuideRegion =
    guideRegion || calculateGuideRegionForFrame(frameWidth, frameHeight);

  logger.debug('🎯 Guide region:', effectiveGuideRegion);
  logger.debug(
    '📐 Frame:',
    frameWidth,
    'x',
    frameHeight,
    'AR:',
    (frameWidth / frameHeight).toFixed(2)
  );
  if (corners.length !== 8) {
    return {
      aligned: false,
      coverage: 0,
      reason: 'Invalid corners array',
    };
  }

  const orderedCorners = orderCorners(corners);

  const normalizedCorners = {
    topLeft: {
      x: orderedCorners.topLeft.x / frameWidth,
      y: orderedCorners.topLeft.y / frameHeight,
    },
    topRight: {
      x: orderedCorners.topRight.x / frameWidth,
      y: orderedCorners.topRight.y / frameHeight,
    },
    bottomRight: {
      x: orderedCorners.bottomRight.x / frameWidth,
      y: orderedCorners.bottomRight.y / frameHeight,
    },
    bottomLeft: {
      x: orderedCorners.bottomLeft.x / frameWidth,
      y: orderedCorners.bottomLeft.y / frameHeight,
    },
  };

  const cardBoundingBox = {
    x: Math.min(
      normalizedCorners.topLeft.x,
      normalizedCorners.topRight.x,
      normalizedCorners.bottomRight.x,
      normalizedCorners.bottomLeft.x
    ),
    y: Math.min(
      normalizedCorners.topLeft.y,
      normalizedCorners.topRight.y,
      normalizedCorners.bottomRight.y,
      normalizedCorners.bottomLeft.y
    ),
    width:
      Math.max(
        normalizedCorners.topLeft.x,
        normalizedCorners.topRight.x,
        normalizedCorners.bottomRight.x,
        normalizedCorners.bottomLeft.x
      ) -
      Math.min(
        normalizedCorners.topLeft.x,
        normalizedCorners.topRight.x,
        normalizedCorners.bottomRight.x,
        normalizedCorners.bottomLeft.x
      ),
    height:
      Math.max(
        normalizedCorners.topLeft.y,
        normalizedCorners.topRight.y,
        normalizedCorners.bottomRight.y,
        normalizedCorners.bottomLeft.y
      ) -
      Math.min(
        normalizedCorners.topLeft.y,
        normalizedCorners.topRight.y,
        normalizedCorners.bottomRight.y,
        normalizedCorners.bottomLeft.y
      ),
  };

  const EDGE_MARGIN = 0.02;
  const touchesFrameEdge =
    cardBoundingBox.x <= EDGE_MARGIN ||
    cardBoundingBox.y <= EDGE_MARGIN ||
    cardBoundingBox.x + cardBoundingBox.width >= 1 - EDGE_MARGIN ||
    cardBoundingBox.y + cardBoundingBox.height >= 1 - EDGE_MARGIN;

  if (touchesFrameEdge) {
    return {
      aligned: false,
      coverage: 0,
      reason: 'Contour touches frame edge',
    };
  }

  const guideWithTolerance = {
    x: effectiveGuideRegion.x - tolerance,
    y: effectiveGuideRegion.y - tolerance,
    width: effectiveGuideRegion.width + tolerance * 2,
    height: effectiveGuideRegion.height + tolerance * 2,
  };

  const isWithinGuide =
    cardBoundingBox.x >= guideWithTolerance.x &&
    cardBoundingBox.y >= guideWithTolerance.y &&
    cardBoundingBox.x + cardBoundingBox.width <=
      guideWithTolerance.x + guideWithTolerance.width &&
    cardBoundingBox.y + cardBoundingBox.height <=
      guideWithTolerance.y + guideWithTolerance.height;

  if (!isWithinGuide) {
    return {
      aligned: false,
      coverage: 0,
      reason: 'Card is outside guide area',
    };
  }

  const cardArea = cardBoundingBox.width * cardBoundingBox.height;
  const guideArea = effectiveGuideRegion.width * effectiveGuideRegion.height;
  const coverage = cardArea / guideArea;

  if (coverage < 0.35) {
    return {
      aligned: false,
      coverage,
      reason: 'Card is too small (coverage < 35%)',
    };
  }

  if (coverage > 1.3) {
    return {
      aligned: false,
      coverage,
      reason: 'Card is too large (coverage > 130%)',
    };
  }

  return {
    aligned: true,
    coverage,
  };
}
