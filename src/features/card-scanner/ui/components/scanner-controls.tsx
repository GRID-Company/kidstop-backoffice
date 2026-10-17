import { Button } from '@heroui/react';

interface ScannerControlsProps {
  onCapture: () => void;
  onReset: () => void;
  disabled: boolean;
  loading: boolean;
  autoCapture?: boolean;
}

export const ScannerControls = ({
  onCapture,
  onReset,
  disabled,
  loading,
  autoCapture = false,
}: ScannerControlsProps) => {
  return (
    <div className='mt-4 flex flex-col gap-2'>
      {autoCapture && (
        <div
          className='rounded-lg border border-blue-700/50 bg-blue-900/30 p-2 text-center text-sm text-blue-200'
          role='status'
          aria-live='polite'
        >
          <span aria-hidden='true'>⚡ </span>
          Modo automático: Mantén la carta estable por 1 frame
        </div>
      )}
      <div className='flex gap-4'>
        <Button
          color='success'
          size='lg'
          onPress={onCapture}
          isDisabled={disabled || autoCapture}
          isLoading={loading}
          className='flex-1 font-bold'
          aria-label={
            loading
              ? 'Procesando captura de carta'
              : autoCapture
                ? 'Modo automático activado'
                : 'Capturar carta manualmente'
          }
        >
          {loading
            ? 'Procesando...'
            : autoCapture
              ? '⚡ Auto'
              : '📷 Capturar Carta'}
        </Button>
        <Button
          color='danger'
          variant='flat'
          size='lg'
          onPress={onReset}
          isDisabled={loading}
          className='font-bold'
          aria-label='Reiniciar escáner y limpiar captura'
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
