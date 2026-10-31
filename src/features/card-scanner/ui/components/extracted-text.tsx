import { Button, Chip } from '@heroui/react';
import { IScannedCardData, IExtractedField } from '../../domain/types';
import {
  getQualityLevel,
  formatConfidencePercentage,
} from '../../domain/confidence.domain';
import toast from 'react-hot-toast';

interface ExtractedTextProps {
  scannedData: IScannedCardData | null;
}

function getConfidenceColor(
  confidence: number
): 'success' | 'warning' | 'danger' | 'default' {
  const level = getQualityLevel(confidence);
  if (level === 'excellent' || level === 'good') return 'success';
  if (level === 'acceptable') return 'warning';
  if (confidence > 0) return 'danger';
  return 'default';
}

function FieldDisplay({
  label,
  field,
}: {
  label: string;
  field: IExtractedField<string | number | null>;
}) {
  if (field.value === null) {
    return (
      <div className='flex items-center justify-between py-2'>
        <span className='text-sm text-gray-400'>{label}:</span>
        <Chip size='sm' color='default' variant='flat'>
          No detectado
        </Chip>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-between py-2'>
      <span className='text-sm text-gray-400'>{label}:</span>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium text-white'>{field.value}</span>
        <Chip
          size='sm'
          color={getConfidenceColor(field.confidence)}
          variant='flat'
        >
          {formatConfidencePercentage(field.confidence)}
        </Chip>
      </div>
    </div>
  );
}

export const ExtractedText = ({ scannedData }: ExtractedTextProps) => {
  if (!scannedData) {
    return (
      <div className='mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4'>
        <p className='text-center text-gray-500'>
          Captura una carta para extraer el texto
        </p>
      </div>
    );
  }

  const extractedText = scannedData.rawOcr.fullText;
  const { extractedData, confidence } = scannedData;

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success('Texto copiado al portapapeles');
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carta-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Texto descargado');
  };

  return (
    <div className='mt-4 space-y-4'>
      <div className='rounded-lg border border-gray-700 bg-gray-900 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='font-semibold text-white'>Datos Extraídos</h3>
          <div className='flex gap-2'>
            <Chip
              size='sm'
              color={getConfidenceColor(confidence.captureQuality)}
              variant='flat'
            >
              📷 {formatConfidencePercentage(confidence.captureQuality)}
            </Chip>
            <Chip
              size='sm'
              color={getConfidenceColor(confidence.ocrQuality)}
              variant='flat'
            >
              📝 {formatConfidencePercentage(confidence.ocrQuality)}
            </Chip>
            <Chip
              size='sm'
              color={getConfidenceColor(confidence.extractionQuality)}
              variant='flat'
            >
              🎯 {formatConfidencePercentage(confidence.extractionQuality)}
            </Chip>
          </div>
        </div>

        <div className='space-y-1 border-t border-gray-700 pt-3'>
          <FieldDisplay label='Nombre' field={extractedData.name} />
          <FieldDisplay label='HP' field={extractedData.hp} />
          <FieldDisplay label='Número' field={extractedData.collectorNumber} />
          <FieldDisplay label='Total' field={extractedData.printedTotal} />
          <FieldDisplay label='Set' field={extractedData.setCode} />
          <FieldDisplay label='Rareza' field={extractedData.rarity} />
          <FieldDisplay label='Idioma' field={extractedData.language} />
          <FieldDisplay label='Año' field={extractedData.printedYear} />
        </div>
      </div>

      <div className='rounded-lg border border-gray-700 bg-gray-900 p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='font-semibold text-white'>Texto OCR Completo</h3>
          <Chip
            size='sm'
            color={getConfidenceColor(confidence.overall)}
            variant='flat'
          >
            General: {formatConfidencePercentage(confidence.overall)}
          </Chip>
        </div>
        <div className='max-h-48 overflow-y-auto rounded bg-gray-800 p-3'>
          <pre className='text-xs whitespace-pre-wrap text-gray-300'>
            {extractedText || 'No se detectó texto'}
          </pre>
        </div>
      </div>

      <div className='flex gap-2'>
        <Button
          color='primary'
          variant='flat'
          onPress={handleCopy}
          className='flex-1'
        >
          Copiar Texto
        </Button>
        <Button
          color='primary'
          variant='flat'
          onPress={handleDownload}
          className='flex-1'
        >
          Descargar .txt
        </Button>
      </div>
    </div>
  );
};
