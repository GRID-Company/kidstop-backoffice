import { useState } from 'react';
import { Button, Chip } from '@heroui/react';
import { IExtractedCardData, IScanConfidence } from '../../domain/types';
import { EditableField } from './editable-field';
import {
  formatConfidencePercentage,
  getQualityLevel,
} from '../../domain/confidence.domain';

interface ExtractedFieldsEditorProps {
  extractedData: IExtractedCardData;
  confidence: IScanConfidence;
  onSave: (updatedData: IExtractedCardData) => void;
  onCancel: () => void;
  disabled?: boolean;
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

export const ExtractedFieldsEditor = ({
  extractedData,
  confidence,
  onSave,
  onCancel,
  disabled = false,
}: ExtractedFieldsEditorProps) => {
  const [editedData, setEditedData] =
    useState<IExtractedCardData>(extractedData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (
    fieldName: keyof IExtractedCardData,
    value: string | number | null
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        normalizedValue: value,
        confidence: value !== null ? prev[fieldName].confidence : 0,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(editedData);
    setHasChanges(false);
  };

  const handleReset = () => {
    setEditedData(extractedData);
    setHasChanges(false);
  };

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border border-gray-700 bg-gray-900 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='font-semibold text-white'>Datos Extraídos</h3>
          <div className='flex gap-2'>
            <Chip
              size='sm'
              color={getConfidenceColor(confidence.captureQuality)}
              variant='flat'
              aria-label={`Calidad de captura: ${formatConfidencePercentage(confidence.captureQuality)}`}
            >
              <span aria-hidden='true'>📷 </span>
              {formatConfidencePercentage(confidence.captureQuality)}
            </Chip>
            <Chip
              size='sm'
              color={getConfidenceColor(confidence.ocrQuality)}
              variant='flat'
              aria-label={`Calidad OCR: ${formatConfidencePercentage(confidence.ocrQuality)}`}
            >
              <span aria-hidden='true'>📝 </span>
              {formatConfidencePercentage(confidence.ocrQuality)}
            </Chip>
            <Chip
              size='sm'
              color={getConfidenceColor(confidence.extractionQuality)}
              variant='flat'
              aria-label={`Calidad de extracción: ${formatConfidencePercentage(confidence.extractionQuality)}`}
            >
              <span aria-hidden='true'>🎯 </span>
              {formatConfidencePercentage(confidence.extractionQuality)}
            </Chip>
          </div>
        </div>

        <div className='space-y-1 border-t border-gray-700 pt-3'>
          <EditableField
            label='Nombre'
            field={editedData.name}
            onChange={(value) => handleFieldChange('name', value)}
            disabled={disabled}
          />
          <EditableField
            label='HP'
            field={editedData.hp}
            type='number'
            onChange={(value) => handleFieldChange('hp', value)}
            disabled={disabled}
          />
          <EditableField
            label='Número'
            field={editedData.collectorNumber}
            onChange={(value) => handleFieldChange('collectorNumber', value)}
            disabled={disabled}
          />
          <EditableField
            label='Total'
            field={editedData.printedTotal}
            onChange={(value) => handleFieldChange('printedTotal', value)}
            disabled={disabled}
          />
          <EditableField
            label='Set'
            field={editedData.setCode}
            onChange={(value) => handleFieldChange('setCode', value)}
            disabled={disabled}
          />
          <EditableField
            label='Rareza'
            field={editedData.rarity}
            onChange={(value) => handleFieldChange('rarity', value)}
            disabled={disabled}
          />
          <EditableField
            label='Idioma'
            field={editedData.language}
            onChange={(value) => handleFieldChange('language', value)}
            disabled={disabled}
          />
          <EditableField
            label='Año'
            field={editedData.printedYear}
            type='number'
            onChange={(value) => handleFieldChange('printedYear', value)}
            disabled={disabled}
          />
        </div>

        {!disabled && (
          <div className='mt-4 flex gap-2 border-t border-gray-700 pt-4'>
            <Button
              color='primary'
              onPress={handleSave}
              isDisabled={!hasChanges}
              className='flex-1'
              aria-label={
                hasChanges
                  ? 'Guardar cambios en los datos extraídos'
                  : 'No hay cambios para guardar'
              }
            >
              Guardar Cambios
            </Button>
            <Button
              color='default'
              variant='flat'
              onPress={handleReset}
              isDisabled={!hasChanges}
              aria-label={
                hasChanges
                  ? 'Deshacer cambios y restaurar valores originales'
                  : 'No hay cambios para deshacer'
              }
            >
              Deshacer
            </Button>
            <Button
              color='danger'
              variant='light'
              onPress={onCancel}
              aria-label='Cancelar edición y volver al escáner'
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
