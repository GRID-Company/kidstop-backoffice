import { Button } from '@heroui/react';
import { IScannedCardData } from '../../domain/types';
import toast from 'react-hot-toast';

interface ScanOcrTextProps {
  scannedData: IScannedCardData;
}

export const ScanOcrText = ({ scannedData }: ScanOcrTextProps) => {
  const extractedText = scannedData.rawOcr.fullText;

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success('Texto copiado al portapapeles');
  };

  return (
    <div className='border-divider rounded-lg border bg-white p-4'>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-content-primary text-sm font-semibold'>
          Texto OCR completo
        </h3>
        <Button size='sm' variant='flat' onPress={handleCopy}>
          Copiar
        </Button>
      </div>
      <div className='bg-neutral-subtle max-h-48 overflow-y-auto rounded p-3'>
        <pre className='text-content-tertiary text-xs whitespace-pre-wrap'>
          {extractedText || 'No se detectó texto'}
        </pre>
      </div>
    </div>
  );
};
