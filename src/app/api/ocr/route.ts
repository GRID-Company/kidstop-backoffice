import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { validateGoogleVisionConfig } from '@/lib/config/google-vision.config';

let visionClient: ImageAnnotatorClient | null = null;

function getVisionClient(): ImageAnnotatorClient {
  if (!visionClient) {
    const config = validateGoogleVisionConfig();
    visionClient = new ImageAnnotatorClient({
      credentials: {
        client_email: config.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: config.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
      requestId: request.headers.get('x-request-id'),
    });

    if (
      error instanceof Error &&
      error.message.includes('configuration error')
    ) {
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
