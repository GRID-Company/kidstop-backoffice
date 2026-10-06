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

function preprocessForContours(src: OpenCVMat, cv: OpenCV): OpenCVMat {
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  const kernel = cv.Mat.ones(5, 5, cv.CV_8U);

  if (src.channels() === 4) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else if (src.channels() === 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  } else {
    src.copyTo(gray);
  }

  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

  cv.meanStdDev(gray, mean, stddev);
  const intensity = mean.data64F?.[0];
  const lower =
    intensity !== undefined ? Math.max(10, Math.round(0.66 * intensity)) : 50;
  const upper =
    intensity !== undefined ? Math.min(255, Math.round(1.33 * intensity)) : 150;

  cv.Canny(blurred, edges, lower, upper);
  const anchor = new cv.Point(-1, -1);
  cv.dilate(edges, edges, kernel, anchor, 2);
  cv.erode(edges, edges, kernel, anchor, 1);

  gray.delete();
  blurred.delete();
  mean.delete();
  stddev.delete();
  kernel.delete();

  return edges;
}

function _snapCornersToHull(cnt: OpenCVMat, cv: OpenCV): number[] | null {
  if (typeof cv.convexHull !== 'function') return null;

  const hull = new cv.Mat();
  const approx = new cv.Mat();

  try {
    cv.convexHull(cnt, hull);
    const peri = cv.arcLength(hull, true);
    cv.approxPolyDP(hull, approx, 0.1 * peri, true);

    if (approx.rows === 4 && approx.data32S && approx.data32S.length >= 8) {
      return [
        approx.data32S[0],
        approx.data32S[1],
        approx.data32S[2],
        approx.data32S[3],
        approx.data32S[4],
        approx.data32S[5],
        approx.data32S[6],
        approx.data32S[7],
      ];
    }
    return null;
  } finally {
    hull.delete();
    approx.delete();
  }
}

function _quadAspectRatio(corners: number[]): number {
  const xs = [corners[0], corners[2], corners[4], corners[6]];
  const ys = [corners[1], corners[3], corners[5], corners[7]];
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  return h > 0 ? w / h : 0;
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

      let quadCorners: number[] | null = _snapCornersToHull(cnt, cv);

      if (!quadCorners) {
        const peri = cv.arcLength(cnt, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(
          cnt,
          approx,
          DETECTION_PARAMS.approxEpsilon * peri,
          true
        );

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

        if (
          vertices === 4 &&
          finalApprox.data32S &&
          finalApprox.data32S.length >= 8
        ) {
          quadCorners = [
            finalApprox.data32S[0],
            finalApprox.data32S[1],
            finalApprox.data32S[2],
            finalApprox.data32S[3],
            finalApprox.data32S[4],
            finalApprox.data32S[5],
            finalApprox.data32S[6],
            finalApprox.data32S[7],
          ];
        }

        finalApprox.delete();
      }

      if (quadCorners) {
        const aspectRatio = _quadAspectRatio(quadCorners);

        if (_isCardAspectRatio(aspectRatio)) {
          candidates.push({
            corners: quadCorners,
            area,
            aspectRatio,
            hasParent,
          });
        }
      }
    }

    candidates.sort((a, b) => {
      if (a.hasParent !== b.hasParent) {
        return a.hasParent ? 1 : -1;
      }
      return b.area - a.area;
    });

    if (candidates.length > 0) {
      const best = candidates[0];
      return { corners: best.corners, found: true, method: 'contours' };
    }

    return { corners: [], found: false, method: 'none' };
  } finally {
    edges.delete();
    contours.delete();
    hierarchy.delete();
  }
}

export function getROIFromGuide(
  frameWidth: number,
  frameHeight: number
): number[] {
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
  const inverted = new cv.Mat();
  const dilatedInverted = new cv.Mat();
  const kernel = cv.Mat.ones(5, 5, cv.CV_8U);

  try {
    if (src.channels() === 4) {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    } else if (src.channels() === 3) {
      cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
    } else {
      src.copyTo(gray);
    }

    cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

    if (typeof cv.bitwise_not === 'function') {
      cv.bitwise_not(thresh, inverted);
      cv.dilate(inverted, dilatedInverted, kernel, new cv.Point(-1, -1), 2);
    }

    const frameArea = src.rows * src.cols;
    const minArea = frameArea * 0.15;
    const maxArea = frameArea * 0.9;
    const masks = dilatedInverted.empty()
      ? [thresh]
      : [thresh, dilatedInverted];

    let maxCardArea = 0;
    let bestCorners: number[] | null = null;

    for (const mask of masks) {
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      try {
        cv.findContours(
          mask,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        );

        for (let i = 0; i < contours.size(); i++) {
          const cnt = contours.get(i);
          const area = cv.contourArea(cnt);

          if (area < minArea || area > maxArea || area <= maxCardArea) continue;

          let corners = _snapCornersToHull(cnt, cv);
          let aspectRatio = corners ? _quadAspectRatio(corners) : 0;

          if (corners && !_isCardAspectRatio(aspectRatio)) {
            corners = null;
          }

          if (!corners) {
            const rect = cv.boundingRect(cnt);
            aspectRatio = rect.width / rect.height;
            if (_isCardAspectRatio(aspectRatio)) {
              corners = [
                rect.x,
                rect.y,
                rect.x + rect.width,
                rect.y,
                rect.x + rect.width,
                rect.y + rect.height,
                rect.x,
                rect.y + rect.height,
              ];
            }
          }

          if (corners) {
            maxCardArea = area;
            bestCorners = corners;
          }
        }
      } finally {
        contours.delete();
        hierarchy.delete();
      }
    }

    if (bestCorners) {
      return { corners: bestCorners, found: true, method: 'contours' };
    }

    return { corners: [], found: false, method: 'none' };
  } finally {
    gray.delete();
    thresh.delete();
    inverted.delete();
    dilatedInverted.delete();
    kernel.delete();
  }
}

function _sampleBackgroundScalar(
  src: OpenCVMat,
  cv: OpenCV
): {
  val: number[];
} {
  const patch = Math.max(8, Math.round(Math.min(src.cols, src.rows) * 0.05));
  const w = Math.min(patch, src.cols);
  const h = Math.min(patch, src.rows);

  const rects = [
    new cv.Rect(0, 0, w, h),
    new cv.Rect(src.cols - w, 0, w, h),
    new cv.Rect(0, src.rows - h, w, h),
    new cv.Rect(src.cols - w, src.rows - h, w, h),
  ];

  const channelMeans: number[][] = [[], [], [], []];

  for (const rect of rects) {
    const roi = src.roi(rect);
    const mean = cv.mean(roi);
    for (let c = 0; c < 4; c++) {
      channelMeans[c].push(mean[c] ?? 0);
    }
    roi.delete();
  }

  const median = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    return Math.round((sorted[1] + sorted[2]) / 2);
  };

  const channels = src.channels();
  const bg = channelMeans.map(median);

  return new cv.Scalar(
    bg[0],
    bg[1],
    bg[2],
    channels === 4 ? 255 : (bg[3] ?? 255)
  );
}

function _rotatedRectCorners(rect: {
  center: { x: number; y: number };
  size: { width: number; height: number };
  angle: number;
}): number[] {
  const rad = (rect.angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const hw = rect.size.width / 2;
  const hh = rect.size.height / 2;

  const local = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ];

  return local.flatMap(([px, py]) => [
    rect.center.x + px * cos - py * sin,
    rect.center.y + px * sin + py * cos,
  ]);
}

function _isCardAspectRatio(aspectRatio: number): boolean {
  return (
    (aspectRatio >= DETECTION_PARAMS.minAspectRatioPortrait &&
      aspectRatio <= DETECTION_PARAMS.maxAspectRatioPortrait) ||
    (aspectRatio >= DETECTION_PARAMS.minAspectRatioLandscape &&
      aspectRatio <= DETECTION_PARAMS.maxAspectRatioLandscape)
  );
}

function _detectByColorSegmentation(
  src: OpenCVMat,
  cv: OpenCV
): IDetectionResult {
  const bgScalar = _sampleBackgroundScalar(src, cv);
  const bg = new cv.Mat(
    src.rows,
    src.cols,
    src.channels() === 4 ? cv.CV_8UC4 : cv.CV_8UC3,
    bgScalar
  );
  const diff = new cv.Mat();
  const diffGray = new cv.Mat();
  const blurred = new cv.Mat();
  const mask = new cv.Mat();
  const openKernel = cv.Mat.ones(3, 3, cv.CV_8U);
  const closeKernel = cv.Mat.ones(9, 9, cv.CV_8U);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    cv.absdiff(src, bg, diff);

    if (diff.channels() === 4) {
      cv.cvtColor(diff, diffGray, cv.COLOR_RGBA2GRAY);
    } else if (diff.channels() === 3) {
      cv.cvtColor(diff, diffGray, cv.COLOR_RGB2GRAY);
    } else {
      diff.copyTo(diffGray);
    }

    cv.GaussianBlur(diffGray, blurred, new cv.Size(5, 5), 0);
    cv.threshold(blurred, mask, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    cv.morphologyEx(mask, mask, cv.MORPH_OPEN, openKernel);
    cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, closeKernel);

    cv.findContours(
      mask,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    const frameArea = src.rows * src.cols;
    const minArea = frameArea * DETECTION_PARAMS.minAreaRatio;
    const maxArea = frameArea * DETECTION_PARAMS.maxAreaRatio;

    let bestArea = 0;
    let bestCorners: number[] = [];

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);

      if (area < minArea || area > maxArea || area <= bestArea) continue;

      let corners: number[] | null = _snapCornersToHull(cnt, cv);
      let aspectRatio: number;

      if (corners) {
        aspectRatio = _quadAspectRatio(corners);
        if (!_isCardAspectRatio(aspectRatio)) {
          corners = null;
        }
      }

      if (!corners && typeof cv.minAreaRect === 'function') {
        const rect = cv.minAreaRect(cnt);
        const w = rect.size.width;
        const h = rect.size.height;
        aspectRatio = w > 0 && h > 0 ? Math.min(w, h) / Math.max(w, h) : 0;
        if (_isCardAspectRatio(aspectRatio)) {
          corners = _rotatedRectCorners(rect);
        }
      } else if (!corners) {
        const rect = cv.boundingRect(cnt);
        aspectRatio = rect.width / rect.height;
        if (_isCardAspectRatio(aspectRatio)) {
          corners = [
            rect.x,
            rect.y,
            rect.x + rect.width,
            rect.y,
            rect.x + rect.width,
            rect.y + rect.height,
            rect.x,
            rect.y + rect.height,
          ];
        }
      }

      if (corners) {
        bestArea = area;
        bestCorners = corners;
      }
    }

    if (bestCorners.length === 8) {
      return { corners: bestCorners, found: true, method: 'contours' };
    }

    return { corners: [], found: false, method: 'none' };
  } finally {
    bg.delete();
    diff.delete();
    diffGray.delete();
    blurred.delete();
    mask.delete();
    openKernel.delete();
    closeKernel.delete();
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

  const colorResult = _detectByColorSegmentation(src, cv);

  if (colorResult.found) {
    return colorResult;
  }

  const thresholdResult = _detectBySimpleThreshold(src, cv);

  if (thresholdResult.found) {
    return thresholdResult;
  }

  const roiCorners = getROIFromGuide(src.cols, src.rows);

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

export function expandCorners(
  corners: ICardCorners,
  factor: number
): ICardCorners {
  const cx =
    (corners.topLeft.x +
      corners.topRight.x +
      corners.bottomRight.x +
      corners.bottomLeft.x) /
    4;
  const cy =
    (corners.topLeft.y +
      corners.topRight.y +
      corners.bottomRight.y +
      corners.bottomLeft.y) /
    4;

  const scale = (p: IPoint): IPoint => ({
    x: cx + (p.x - cx) * factor,
    y: cy + (p.y - cy) * factor,
  });

  return {
    topLeft: scale(corners.topLeft),
    topRight: scale(corners.topRight),
    bottomRight: scale(corners.bottomRight),
    bottomLeft: scale(corners.bottomLeft),
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

  const quadPoints = [
    orderedCorners.topLeft,
    orderedCorners.topRight,
    orderedCorners.bottomRight,
    orderedCorners.bottomLeft,
  ];

  const interiorAngle = (
    prev: IPoint,
    current: IPoint,
    next: IPoint
  ): number => {
    const v1x = prev.x - current.x;
    const v1y = prev.y - current.y;
    const v2x = next.x - current.x;
    const v2y = next.y - current.y;
    const dot = v1x * v2x + v1y * v2y;
    const mag = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y);
    if (mag === 0) return 0;
    const cos = Math.max(-1, Math.min(1, dot / mag));
    return (Math.acos(cos) * 180) / Math.PI;
  };

  const maxSkew = quadPoints.some(
    (_, i) =>
      interiorAngle(
        quadPoints[(i + 3) % 4],
        quadPoints[i],
        quadPoints[(i + 1) % 4]
      ) < 55
  );

  if (maxSkew) {
    return {
      aligned: false,
      coverage: 0,
      reason: 'Extreme camera angle',
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

export function getFriendlyPipelineError(message: string): string {
  if (message.startsWith('Forma de carta no válida')) {
    return 'No pudimos encuadrar la carta. Alinéala dentro de la guía e inténtalo de nuevo.';
  }
  if (message.startsWith('Calidad de captura insuficiente')) {
    return 'La foto no salió clara. Busca mejor luz y un fondo liso, e inténtalo de nuevo.';
  }
  if (message.startsWith('Calidad de OCR insuficiente')) {
    return 'No se pudo leer el texto de la carta. Acércate más y evita los reflejos.';
  }
  if (message.startsWith('Vision API error')) {
    return 'No pudimos analizar la imagen. Revisa tu conexión e inténtalo de nuevo.';
  }
  return message;
}
