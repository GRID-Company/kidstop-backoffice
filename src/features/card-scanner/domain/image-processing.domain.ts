import { OpenCV, OpenCVMat } from './types';

export type PreprocessingStrategy =
  | 'original'
  | 'grayscale'
  | 'enhanced'
  | 'threshold';

/**
 * Preprocesa una imagen para OCR aplicando diferentes estrategias
 *
 * @param src - Matriz de imagen de entrada (NO se modifica, NO se libera)
 * @param cv - Instancia OpenCV
 * @param strategy - Estrategia de preprocesamiento (default: 'enhanced')
 * @returns Nueva matriz procesada (DEBE liberarse con .delete())
 * @throws Error si src es null, undefined o vacío
 * @throws Error si cv no está inicializado
 */
export function preprocessImageForOCR(
  src: OpenCVMat,
  cv: OpenCV,
  strategy: PreprocessingStrategy = 'enhanced'
): OpenCVMat {
  if (!src) {
    throw new Error('preprocessImageForOCR: src cannot be null or undefined');
  }
  if (src.empty?.()) {
    throw new Error('preprocessImageForOCR: src cannot be empty');
  }
  if (!cv) {
    throw new Error('preprocessImageForOCR: OpenCV instance is required');
  }

  if (strategy === 'original') {
    return src.clone();
  }

  const gray = new cv.Mat();

  try {
    if (src.channels() === 4) {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    } else if (src.channels() === 3) {
      cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
    } else {
      src.copyTo(gray);
    }

    if (strategy === 'grayscale') {
      return gray;
    }

    if (strategy === 'enhanced') {
      const enhanced = new cv.Mat();
      const alpha = 1.2;
      const beta = 10;

      gray.convertTo(enhanced, -1, alpha, beta);

      gray.delete();
      return enhanced;
    }

    if (strategy === 'threshold') {
      const thresholded = new cv.Mat();
      cv.threshold(
        gray,
        thresholded,
        0,
        255,
        cv.THRESH_BINARY + cv.THRESH_OTSU
      );

      gray.delete();
      return thresholded;
    }

    return gray;
  } catch (error) {
    gray.delete();
    throw error;
  }
}

export function preprocessImageForOCRAggressive(
  src: OpenCVMat,
  cv: OpenCV
): OpenCVMat {
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const sharpened = new cv.Mat();
  const enhanced = new cv.Mat();

  if (src.channels() === 4) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else if (src.channels() === 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  } else {
    src.copyTo(gray);
  }

  const kernel = cv.Mat.ones(3, 3, cv.CV_32F);
  if (!kernel.data32F || kernel.data32F.length === 0) {
    kernel.delete();
    gray.delete();
    throw new Error(
      'preprocessImageForOCRAggressive: kernel.data32F is not available'
    );
  }
  for (let i = 0; i < kernel.data32F.length; i++) {
    kernel.data32F[i] = -1;
  }
  kernel.data32F[4] = 9;

  cv.filter2D(gray, sharpened, cv.CV_8U, kernel);

  cv.GaussianBlur(sharpened, blurred, new cv.Size(1, 1), 0);

  cv.threshold(blurred, enhanced, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

  kernel.delete();
  gray.delete();
  blurred.delete();
  sharpened.delete();

  return enhanced;
}

export function upscaleImage(
  src: OpenCVMat,
  cv: OpenCV,
  scale: number = 2
): OpenCVMat {
  const upscaled = new cv.Mat();
  const dsize = new cv.Size(src.cols * scale, src.rows * scale);
  cv.resize(src, upscaled, dsize, 0, 0, cv.INTER_CUBIC);
  return upscaled;
}

export function enhanceContrast(
  src: OpenCVMat,
  cv: OpenCV,
  alpha: number = 1.2,
  beta: number = 10
): OpenCVMat {
  const enhanced = new cv.Mat();
  src.convertTo(enhanced, -1, alpha, beta);
  return enhanced;
}

/**
 * Aplica filtro de denoising para reducir ruido preservando detalles
 *
 * ⚠️ IMPORTANTE: El caller debe hacer .delete() del resultado cuando termine
 *
 * @param src - Matriz de entrada (NO se modifica, NO se libera)
 * @param cv - Instancia OpenCV
 * @returns Nueva matriz con filtro aplicado (DEBE liberarse con .delete())
 * @throws Error si src es null, undefined o vacío
 * @throws Error si cv no está inicializado
 */
export function denoiseImage(src: OpenCVMat, cv: OpenCV): OpenCVMat {
  if (!src) {
    throw new Error('denoiseImage: src cannot be null or undefined');
  }
  if (src.empty?.()) {
    throw new Error('denoiseImage: src cannot be empty');
  }
  if (!cv) {
    throw new Error('denoiseImage: OpenCV instance is required');
  }

  const denoised = new cv.Mat();

  try {
    if (src.channels() === 1) {
      cv.fastNlMeansDenoising(src, denoised, 10, 7, 21);
    } else if (src.channels() === 3) {
      cv.fastNlMeansDenoisingColored(denoised, src, 10, 10, 7, 21);
    } else {
      src.copyTo(denoised);
    }

    return denoised;
  } catch (error) {
    denoised.delete();
    throw error;
  }
}
