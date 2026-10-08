import { Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ScannerCaptureButtonProps {
  onCapture: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ScannerCaptureButton = ({
  onCapture,
  disabled = false,
  loading = false,
}: ScannerCaptureButtonProps) => {
  return (
    <Button
      isIconOnly
      radius='full'
      onPress={onCapture}
      isDisabled={disabled || loading}
      aria-label='Capturar carta'
      className='bg-accent h-16 w-16 border-4 border-white/90 text-white shadow-xl transition-transform active:scale-95'
    >
      {loading ? (
        <Spinner size='sm' color='white' />
      ) : (
        <Icon icon='lucide:camera' width={28} aria-hidden='true' />
      )}
    </Button>
  );
};
