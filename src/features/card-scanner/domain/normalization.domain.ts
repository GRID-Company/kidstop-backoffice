import { ICardCorners, OpenCV, OpenCVMat } from './types';
import { NORMALIZED_CARD_DIMENSIONS } from './constants';

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
  const globalSharpness = Math.min(variance / 500, 1.0);

  gray.delete();
  laplacian.delete();
  mean.delete();
  stddev.delete();

  const roiX = Math.max(
    0,
    Math.floor(
      Math.min(
        corners.topLeft.x,
        corners.topRight.x,
        corners.bottomRight.x,
        corners.bottomLeft.x
      )
    )
  );
  const roiY = Math.max(
    0,
    Math.floor(
      Math.min(
        corners.topLeft.y,
        corners.topRight.y,
        corners.bottomRight.y,
        corners.bottomLeft.y
      )
    )
  );
  const roiRight = Math.min(
    mat.cols,
    Math.ceil(
      Math.max(
        corners.topLeft.x,
        corners.topRight.x,
        corners.bottomRight.x,
        corners.bottomLeft.x
      )
    )
  );
  const roiBottom = Math.min(
    mat.rows,
    Math.ceil(
      Math.max(
        corners.topLeft.y,
        corners.topRight.y,
        corners.bottomRight.y,
        corners.bottomLeft.y
      )
    )
  );

  let zoneSharpness = globalSharpness;
  if (roiRight - roiX > 24 && roiBottom - roiY > 24) {
    const cardRoi = mat.roi(
      new cv.Rect(roiX, roiY, roiRight - roiX, roiBottom - roiY)
    );
    zoneSharpness = calculateMinZoneSharpness(cardRoi, cv);
    cardRoi.delete();
  }

  const sharpnessScore = Math.min(globalSharpness, zoneSharpness);

  const expectedRatio =
    NORMALIZED_CARD_DIMENSIONS.width / NORMALIZED_CARD_DIMENSIONS.height;
  const actualRatio = cardWidth / cardHeight;
  const ratioDiff = Math.abs(expectedRatio - actualRatio);
  const perspectiveScore = Math.max(0, 1 - ratioDiff * 2);

  const overallQuality =
    areaScore * 0.4 + sharpnessScore * 0.4 + perspectiveScore * 0.2;

  return Math.max(0, Math.min(1, overallQuality));
}

export function calculateGlareRatio(mat: OpenCVMat, cv: OpenCV): number {
  const gray = new cv.Mat();
  const mask = new cv.Mat();

  if (mat.channels() === 4) {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  } else if (mat.channels() === 3) {
    cv.cvtColor(mat, gray, cv.COLOR_RGB2GRAY);
  } else {
    mat.copyTo(gray);
  }

  cv.threshold(gray, mask, 240, 255, cv.THRESH_BINARY);
  const mean = cv.mean(mask);

  gray.delete();
  mask.delete();

  return (mean[0] ?? 0) / 255;
}

export function calculateBrightness(mat: OpenCVMat, cv: OpenCV): number {
  const gray = new cv.Mat();

  if (mat.channels() === 4) {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  } else if (mat.channels() === 3) {
    cv.cvtColor(mat, gray, cv.COLOR_RGB2GRAY);
  } else {
    mat.copyTo(gray);
  }

  const mean = cv.mean(gray);
  gray.delete();

  return (mean[0] ?? 0) / 255;
}

export function calculateMinZoneSharpness(
  mat: OpenCVMat,
  cv: OpenCV,
  gridRows: number = 4,
  gridCols: number = 3
): number {
  const gray = new cv.Mat();

  if (mat.channels() === 4) {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  } else if (mat.channels() === 3) {
    cv.cvtColor(mat, gray, cv.COLOR_RGB2GRAY);
  } else {
    mat.copyTo(gray);
  }

  const cellWidth = Math.floor(gray.cols / gridCols);
  const cellHeight = Math.floor(gray.rows / gridRows);

  if (cellWidth <= 0 || cellHeight <= 0) {
    gray.delete();
    return 0;
  }

  let minSharpness = Infinity;

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const cell = gray.roi(
        new cv.Rect(
          col * cellWidth,
          row * cellHeight,
          Math.min(cellWidth, gray.cols - col * cellWidth),
          Math.min(cellHeight, gray.rows - row * cellHeight)
        )
      );

      const laplacian = new cv.Mat();
      const mean = new cv.Mat();
      const stddev = new cv.Mat();

      cv.Laplacian(cell, laplacian, cv.CV_64F);
      cv.meanStdDev(laplacian, mean, stddev);

      const variance =
        stddev.data64F && stddev.data64F.length > 0
          ? stddev.data64F[0] * stddev.data64F[0]
          : 0;

      minSharpness = Math.min(minSharpness, Math.min(variance / 500, 1.0));

      cell.delete();
      laplacian.delete();
      mean.delete();
      stddev.delete();
    }
  }

  gray.delete();

  return minSharpness === Infinity ? 0 : minSharpness;
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
