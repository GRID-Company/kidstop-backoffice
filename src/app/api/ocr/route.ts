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
    console.error('[OCR] Invalid private key shape', {
      length: raw.length,
      head: raw.slice(0, 32),
      tail: raw.slice(-32),
      hasBeginMarker: key.includes('BEGIN PRIVATE KEY'),
      realNewlines: (normalized.match(/\n/g) ?? []).length,
    });
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

    const [result] = await client.documentTextDetection({
      image: { content: base64Image },
    });

    const annotation = result.fullTextAnnotation;

    if (!annotation || !annotation.pages || annotation.pages.length === 0) {
      return NextResponse.json({
        text: '',
        confidence: 0,
        words: [],
      });
    }

    const fullText = annotation.text || '';

    const words: Array<{
      text: string;
      confidence: number;
      boundingBox: Array<{ x: number; y: number }> | undefined;
    }> = [];

    for (const page of annotation.pages) {
      for (const block of page.blocks ?? []) {
        for (const paragraph of block.paragraphs ?? []) {
          for (const word of paragraph.words ?? []) {
            const text = (word.symbols ?? [])
              .map((symbol) => symbol.text ?? '')
              .join('');

            if (!text.trim()) continue;

            words.push({
              text,
              confidence: word.confidence ?? 0,
              boundingBox: word.boundingBox?.vertices?.map((v) => ({
                x: v.x ?? 0,
                y: v.y ?? 0,
              })),
            });
          }
        }
      }
    }

    const confidence = annotation.pages[0]?.confidence ?? 0;

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
