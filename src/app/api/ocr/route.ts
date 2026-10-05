import { createPrivateKey } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { validateGoogleVisionConfig } from '@/lib/config/google-vision.config';

let visionClient: ImageAnnotatorClient | null = null;

function normalizePrivateKey(raw: string): string {
  let key = raw.trim().replace(/^["']+|["']+$/g, '');

  if (!key.includes('BEGIN PRIVATE KEY')) {
    key = Buffer.from(key, 'base64').toString('utf8').trim();
  }

  const normalized = key
    .replace(/\r\n/g, '\n')
    .replace(/\\\\n/g, '\\n')
    .replace(/\\n/g, '\n');

  try {
    createPrivateKey(normalized);
  } catch {
    throw new Error(
      'GOOGLE_CLOUD_PRIVATE_KEY is not a valid PEM. Store the base64 of the key file instead (e.g. `base64 -i key.pem`).'
    );
  }

  return normalized;
}

function getVisionClient(): ImageAnnotatorClient {
  if (!visionClient) {
    const config = validateGoogleVisionConfig();

    visionClient = new ImageAnnotatorClient({
      credentials: {
        client_email: config.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: normalizePrivateKey(config.GOOGLE_CLOUD_PRIVATE_KEY),
      },
      projectId: config.GOOGLE_CLOUD_PROJECT_ID,
    });
  }
  return visionClient;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('jwt')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getVisionClient();

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    console.error('🔍 Llamando a Google Vision API...');

    const [result] = await client.textDetection({
      image: { content: base64Image },
    });

    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      console.error('⚠️ No se detectó texto en la imagen');
      return NextResponse.json({
        text: '',
        confidence: 0,
        words: [],
      });
    }

    const fullText = detections[0].description || '';
    const confidence = detections[0].confidence || 0;

    const words = detections.slice(1).map((word) => ({
      text: word.description,
      confidence: word.confidence || 0,
      boundingBox: word.boundingPoly?.vertices,
    }));

    console.error(
      `✅ Texto extraído: ${fullText.substring(0, 50)}... (${(confidence * 100).toFixed(1)}% confianza)`
    );

    return NextResponse.json({
      text: fullText,
      confidence,
      words,
    });
  } catch (error) {
    console.error('[OCR Error]', {
      timestamp: new Date().toISOString(),
      type: error instanceof Error ? error.constructor.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      requestId: request.headers.get('x-request-id'),
    });

    if (
      error instanceof Error &&
      error.message.includes('configuration error')
    ) {
      return NextResponse.json(
        { error: 'Service configuration error', details: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Processing failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
