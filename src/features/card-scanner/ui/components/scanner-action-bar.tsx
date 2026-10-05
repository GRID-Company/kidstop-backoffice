import { Button, Spinner, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ScannerStatus } from '../../domain/types';

interface ScannerActionBarProps {
  status: ScannerStatus;
  autoCapture: boolean;
  onAutoCaptureChange: (enabled: boolean) => void;
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
  onCapture,
  onReset,
  disabled,
}: ScannerActionBarProps) => {
  const isProcessing = PROCESSING_STATUSES.includes(status);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <Switch
          size='sm'
          isSelected={autoCapture}
          onValueChange={onAutoCaptureChange}
        >
          <span className='text-content-primary text-xs'>
            Captura automática
          </span>
        </Switch>
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
          isDisabled={disabled || autoCapture || isProcessing}
          isLoading={isProcessing}
          className='bg-accent flex-1 font-semibold text-white'
          startContent={
            !isProcessing && <Icon icon='lucide:camera' width={18} />
          }
          aria-label={
            autoCapture
              ? 'Modo automático activado'
              : 'Capturar carta manualmente'
          }
        >
          {isProcessing
            ? 'Procesando...'
            : autoCapture
              ? 'Automático activo'
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
