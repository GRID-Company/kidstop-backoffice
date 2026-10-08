import { RefObject, ReactNode } from 'react';
import { CardPositioningGuide } from './card-positioning-guide';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cvReady: boolean;
  cardDetected?: boolean;
  torchControl?: ReactNode;
  toggleControls?: ReactNode;
  captureControl?: ReactNode;
}

export const CameraPreview = ({
  videoRef,
  canvasRef,
  cvReady,
  cardDetected = false,
  torchControl,
  toggleControls,
  captureControl,
}: CameraPreviewProps) => {
  return (
    <div
      className='border-accent relative aspect-3/4 w-full overflow-hidden rounded-lg border-4 bg-black'
      role='region'
      aria-label='Vista previa de la cámara para escaneo de cartas'
    >
      <video
        ref={videoRef}
        className={cvReady ? 'hidden' : 'h-full w-full object-cover'}
        playsInline
        muted
        autoPlay
        aria-label='Transmisión en vivo de la cámara'
      />
      <canvas
        ref={canvasRef}
        className={cvReady ? 'h-full w-full object-cover' : 'hidden'}
        role='img'
        aria-label='Procesamiento de imagen de carta con detección de bordes'
      />

      {cvReady && <CardPositioningGuide cardDetected={cardDetected} />}

      {toggleControls && (
        <div className='absolute top-4 left-4 z-10'>{toggleControls}</div>
      )}

      {torchControl && (
        <div className='absolute top-4 right-4 z-10'>{torchControl}</div>
      )}

      {captureControl && (
        <div className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2'>
          {captureControl}
        </div>
      )}

      {!cvReady && (
        <div
          className='absolute inset-0 flex items-center justify-center bg-black/50'
          role='status'
          aria-live='polite'
        >
          <div className='text-center text-white'>
            <div className='mb-2 text-4xl' aria-hidden='true'>
              ⏳
            </div>
            <div className='text-sm'>Cargando procesamiento...</div>
          </div>
        </div>
      )}
    </div>
  );
};
