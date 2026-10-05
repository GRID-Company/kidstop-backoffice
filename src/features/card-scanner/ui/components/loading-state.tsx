import { useEffect, useRef } from 'react';
import { Spinner } from '@heroui/react';
import { ScannerStatus } from '../../domain/types';
import { useFocusTrap } from '@/lib/hooks/use-focus-trap';

interface LoadingStateProps {
  status: ScannerStatus;
}

const STATUS_MESSAGES: Record<
  ScannerStatus,
  { message: string; icon: string }
> = {
  initializing: { message: 'Inicializando...', icon: '⚙️' },
  'camera-ready': { message: 'Cámara lista', icon: '📷' },
  detecting: { message: 'Detectando carta...', icon: '🔍' },
  'card-stable': { message: 'Carta detectada', icon: '✓' },
  capturing: { message: 'Capturando imagen...', icon: '📸' },
  'processing-image': { message: 'Procesando imagen...', icon: '🖼️' },
  'extracting-text': { message: 'Extrayendo texto...', icon: '📝' },
  searching: { message: 'Buscando en catálogo...', icon: '🔎' },
  results: { message: 'Resultados listos', icon: '✅' },
  error: { message: 'Error', icon: '❌' },
};

export const LoadingState = ({ status }: LoadingStateProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isLoading =
    status === 'capturing' ||
    status === 'processing-image' ||
    status === 'extracting-text' ||
    status === 'searching';

  useFocusTrap(dialogRef as React.RefObject<HTMLElement>, isLoading);

  useEffect(() => {
    if (isLoading && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isLoading]);

  if (!isLoading && status !== 'detecting') {
    return null;
  }

  const { message, icon } = STATUS_MESSAGES[status];

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      role='status'
      aria-live='assertive'
      aria-label={message}
    >
      <div
        ref={dialogRef}
        className='rounded-lg bg-gray-900 p-6 shadow-xl'
        role='alert'
        tabIndex={-1}
      >
        <div className='flex flex-col items-center gap-4'>
          <div className='text-4xl' aria-hidden='true'>
            {icon}
          </div>
          <div className='flex items-center gap-3'>
            {isLoading && (
              <Spinner size='md' color='primary' aria-label='Procesando' />
            )}
            <span className='text-lg font-medium text-white'>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
