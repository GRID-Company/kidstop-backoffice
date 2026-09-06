/**
 * @deprecated This file is legacy code and is not used in the active pipeline.
 * The card scanner now uses Google Cloud Vision API (google-vision.ts) for OCR.
 * This file is kept for reference only.
 *
 * @see google-vision.ts for the current OCR implementation
 */

import { createWorker, RecognizeResult } from 'tesseract.js';
import { TESSERACT_LANG } from '../../domain/constants';

/**
 * @deprecated Use extractTextWithVision from google-vision.ts instead
 */
export async function createOCRWorker(lang: string = TESSERACT_LANG) {
  const worker = await createWorker(lang, 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        console.error(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  await worker.setParameters({
    tessedit_char_whitelist:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789áéíóúñÁÉÍÓÚÑ.,;:()[]{}+-×÷=<>!?¿¡/@#$%&* ',
  });

  return worker;
}

/**
 * @deprecated Use extractTextWithVision from google-vision.ts instead
 */
export async function extractTextFromImage(
  imageDataUrl: string
): Promise<RecognizeResult> {
  console.error('🚀 Iniciando worker de Tesseract...');
  const worker = await createOCRWorker();

  console.error('🔍 Reconociendo texto...');
  const result = await worker.recognize(imageDataUrl);

  console.error(
    `✅ Texto extraído con ${result.data.confidence.toFixed(1)}% de confianza`
  );
  await worker.terminate();

  return result;
}
