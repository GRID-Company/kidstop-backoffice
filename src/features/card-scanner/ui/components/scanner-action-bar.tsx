import { Button, Spinner, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ScannerStatus } from '../../domain/types';

interface ScannerActionBarProps {
  status: ScannerStatus;
  autoCapture: boolean;
  onAutoCaptureChange: (enabled: boolean) => void;
  aiSearchOnly: boolean;
  onAiSearchOnlyChange: (enabled: boolean) => void;
  onCapture: () => void;
  onReset: () => void;
  disabled: boolean;
}

const PROCESSING_STATUSES: ScannerStatus[] = [
  'capturing',
  'processing-image',
  'extracting-text',
  'searching',
];

export const ScannerActionBar = ({
  status,
  autoCapture,
  onAutoCaptureChange,
  aiSearchOnly,
  onAiSearchOnlyChange,
  onCapture,
  onReset,
  disabled,
}: ScannerActionBarProps) => {
  const isProcessing = PROCESSING_STATUSES.includes(status);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {!aiSearchOnly && (
            <Switch
              size='sm'
              isSelected={autoCapture}
              onValueChange={onAutoCaptureChange}
            >
              <span className='text-content-primary text-xs'>
                Captura automática
              </span>
            </Switch>
          )}
          <Switch
            size='sm'
            isSelected={aiSearchOnly}
            onValueChange={onAiSearchOnlyChange}
          >
            <span className='text-content-primary text-xs'>
              Búsqueda solo con IA
            </span>
          </Switch>
        </div>
        {isProcessing && (
          <div className='text-content-tertiary flex items-center gap-2 text-xs'>
            <Spinner size='sm' />
            <span>Procesando...</span>
          </div>
        )}
      </div>
      <div className='flex gap-3'>
        <Button
          size='lg'
          onPress={onCapture}
          isDisabled={disabled || isProcessing}
          isLoading={isProcessing}
          className='bg-accent flex-1 font-semibold text-white'
          startContent={
            !isProcessing && <Icon icon='lucide:camera' width={18} />
          }
          aria-label='Capturar carta manualmente'
        >
          {isProcessing
            ? 'Procesando...'
            : autoCapture
              ? 'Capturar ahora'
              : 'Capturar carta'}
        </Button>
        <Button
          variant='flat'
          size='lg'
          onPress={onReset}
          isDisabled={isProcessing}
          className='text-content-primary font-semibold'
          startContent={<Icon icon='lucide:rotate-ccw' width={16} />}
          aria-label='Reiniciar escáner y limpiar captura'
        >
          Reiniciar
        </Button>
      </div>
    </div>
  );
};
