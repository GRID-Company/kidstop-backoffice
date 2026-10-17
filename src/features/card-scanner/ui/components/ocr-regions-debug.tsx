import { Card, CardBody, Chip } from '@heroui/react';
import { IRegionalOcrResult } from '../../domain/types';
import Image from 'next/image';

interface OcrRegionsDebugProps {
  regionalOcr: IRegionalOcrResult;
  compositeImageUrl?: string;
}

export const OcrRegionsDebug = ({
  regionalOcr,
  compositeImageUrl,
}: OcrRegionsDebugProps) => {
  return (
    <Card className='bg-gray-900'>
      <CardBody>
        <h4 className='mb-3 font-semibold text-white'>Debug: Regiones OCR</h4>

        {compositeImageUrl && (
          <div className='mb-4'>
            <p className='mb-2 text-sm font-medium text-white'>
              Imagen Compuesta Enviada a Vision:
            </p>
            <div className='relative max-h-96 overflow-auto rounded border border-gray-600 bg-gray-800'>
              <Image
                src={compositeImageUrl}
                alt='Composite OCR'
                width={800}
                height={400}
                className='w-full'
                unoptimized
              />
            </div>
          </div>
        )}

        <div className='space-y-3'>
          <div>
            <p className='mb-1 text-sm font-medium text-white'>
              Texto Completo:
            </p>
            <div className='max-h-32 overflow-auto rounded border border-gray-600 bg-gray-800 p-3 text-sm text-white'>
              {regionalOcr.fullText || '(vacío)'}
            </div>
          </div>

          <div>
            <p className='mb-2 text-sm font-medium text-white'>
              Regiones Detectadas:
            </p>
            <div className='space-y-2'>
              {Object.entries(regionalOcr.regions).map(([regionId, data]) => (
                <div
                  key={regionId}
                  className='rounded border border-gray-600 bg-gray-800 p-3'
                >
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-sm font-semibold text-blue-400'>
                      {regionId}
                    </span>
                    <Chip size='sm' variant='flat' color='primary'>
                      {data.averageConfidence !== null
                        ? `${(data.averageConfidence * 100).toFixed(0)}%`
                        : 'N/A'}
                    </Chip>
                  </div>
                  <p className='text-sm font-medium text-white'>
                    {data.text || '(sin texto)'}
                  </p>
                  {data.tokens && data.tokens.length > 0 && (
                    <div className='mt-2 text-xs text-gray-400'>
                      {data.tokens.length} token(s)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
