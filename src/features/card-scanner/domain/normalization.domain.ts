import { ICardCorners, OpenCV, OpenCVMat } from './types';
import { NORMALIZED_CARD_DIMENSIONS } from './constants';

export function detectOrientation(
  mat: OpenCVMat,
  _cv: OpenCV
): 0 | 90 | 180 | 270 {
  const aspectRatio = mat.cols / mat.rows;

  if (aspectRatio > 1.2) {
    return 90;
  }

  if (aspectRatio < 0.6) {
    return 0;
  }

  return 0;
}

/**
 * Rota una imagen a un ángulo específico
 *
 * @param mat - Matriz de imagen (no puede ser null)
 * @param degrees - Ángulo de rotación (0, 90, 180, 270)
 * @param cv - Instancia de OpenCV.js
 * @returns Nueva matriz rotada (DEBE liberarse con .delete())
 * @throws Error si mat es null, undefined o vacío
 * @throws Error si cv no está inicializado
 */
export function rotateCard(
  mat: OpenCVMat,
  degrees: 0 | 90 | 180 | 270,
  cv: OpenCV
): OpenCVMat {
  if (!mat) {
    throw new Error('rotateCard: mat cannot be null or undefined');
  }
  if (mat.empty?.()) {
    throw new Error('rotateCard: mat cannot be empty');
  }
  if (!cv) {
    throw new Error('rotateCard: OpenCV instance is required');
  }

  if (degrees === 0) {
    return mat.clone();
  }

  const rotated = new cv.Mat();

  try {
    if (degrees === 90) {
      cv.rotate(mat, rotated, cv.ROTATE_90_CLOCKWISE);
    } else if (degrees === 180) {
      cv.rotate(mat, rotated, cv.ROTATE_180);
    } else if (degrees === 270) {
      cv.rotate(mat, rotated, cv.ROTATE_90_COUNTERCLOCKWISE);
    }
    return rotated;
  } catch (error) {
    rotated.delete();
    throw new Error(
      `rotateCard failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function calculateCaptureQuality(
  mat: OpenCVMat,
  corners: ICardCorners,
  frameSize: { width: number; height: number },
  cv: OpenCV
): number {
  const cardWidth = Math.max(
    Math.hypot(
      corners.topRight.x - corners.topLeft.x,
      corners.topRight.y - corners.topLeft.y
    ),
    Math.hypot(
      corners.bottomRight.x - corners.bottomLeft.x,
      corners.bottomRight.y - corners.bottomLeft.y
    )
  );

  const cardHeight = Math.max(
    Math.hypot(
      corners.bottomLeft.x - corners.topLeft.x,
      corners.bottomLeft.y - corners.topLeft.y
    ),
    Math.hypot(
      corners.bottomRight.x - corners.topRight.x,
      corners.bottomRight.y - corners.topRight.y
    )
  );

  const cardArea = cardWidth * cardHeight;
  const frameArea = frameSize.width * frameSize.height;
  const areaRatio = cardArea / frameArea;

  const areaScore = Math.min(areaRatio / 0.5, 1.0);

  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

  const laplacian = new cv.Mat();
  cv.Laplacian(gray, laplacian, cv.CV_64F);

  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  cv.meanStdDev(laplacian, mean, stddev);

  if (!stddev.data64F || stddev.data64F.length === 0) {
    throw new Error('calculateCaptureQuality: stddev.data64F is not available');
  }

  const variance = stddev.data64F[0] * stddev.data64F[0];
  const sharpnessScore = Math.min(variance / 500, 1.0);

  gray.delete();
  laplacian.delete();
  mean.delete();
  stddev.delete();

  const expectedRatio =
    NORMALIZED_CARD_DIMENSIONS.width / NORMALIZED_CARD_DIMENSIONS.height;
  const actualRatio = cardWidth / cardHeight;
  const ratioDiff = Math.abs(expectedRatio - actualRatio);
  const perspectiveScore = Math.max(0, 1 - ratioDiff * 2);

  const overallQuality =
    areaScore * 0.4 + sharpnessScore * 0.4 + perspectiveScore * 0.2;

  return Math.max(0, Math.min(1, overallQuality));
}

export function calculateSharpness(mat: OpenCVMat, cv: OpenCV): number {
  const gray = new cv.Mat();

  if (mat.channels() === 4) {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  } else if (mat.channels() === 3) {
    cv.cvtColor(mat, gray, cv.COLOR_RGB2GRAY);
  } else {
    mat.copyTo(gray);
  }

  const laplacian = new cv.Mat();
  cv.Laplacian(gray, laplacian, cv.CV_64F);

  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  cv.meanStdDev(laplacian, mean, stddev);

  if (!stddev.data64F || stddev.data64F.length === 0) {
    gray.delete();
    laplacian.delete();
    mean.delete();
    stddev.delete();
    throw new Error('calculateSharpness: stddev.data64F is not available');
  }

  const variance = stddev.data64F[0] * stddev.data64F[0];

  gray.delete();
  laplacian.delete();
  mean.delete();
  stddev.delete();

  return Math.min(variance / 500, 1.0);
}
