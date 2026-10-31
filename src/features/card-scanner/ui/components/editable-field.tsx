import { useState } from 'react';
import { Input, Chip, Button } from '@heroui/react';
import { IExtractedField } from '../../domain/types';
import { getQualityLevel } from '../../domain/confidence.domain';

interface EditableFieldProps {
  label: string;
  field: IExtractedField<string | number | null>;
  type?: 'text' | 'number';
  onChange: (value: string | number | null) => void;
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

export const EditableField = ({
  label,
  field,
  type = 'text',
  onChange,
  disabled = false,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(field.value?.toString() || '');

  const handleSave = () => {
    if (type === 'number') {
      const numValue = editValue ? parseFloat(editValue) : null;
      onChange(numValue);
    } else {
      onChange(editValue || null);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(field.value?.toString() || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className='flex items-center gap-2 py-2'>
        <span className='min-w-25 text-sm text-gray-400'>{label}:</span>
        <div className='flex flex-1 items-center gap-2'>
          <Input
            size='sm'
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            type={type}
            className='flex-1'
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <Button
            size='sm'
            color='success'
            variant='flat'
            onPress={handleSave}
            aria-label={`Guardar cambios en ${label}`}
          >
            ✓
          </Button>
          <Button
            size='sm'
            color='danger'
            variant='flat'
            onPress={handleCancel}
            aria-label={`Cancelar edición de ${label}`}
          >
            ✕
          </Button>
        </div>
      </div>
    );
  }

  if (field.value === null) {
    return (
      <div className='flex items-center justify-between py-2'>
        <span className='text-sm text-gray-400'>{label}:</span>
        <div className='flex items-center gap-2'>
          <Chip size='sm' color='default' variant='flat'>
            No detectado
          </Chip>
          {!disabled && (
            <Button
              size='sm'
              variant='light'
              onPress={() => setIsEditing(true)}
              className='text-xs'
              aria-label={`Agregar valor para ${label}`}
            >
              Agregar
            </Button>
          )}
        </div>
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
          {(field.confidence * 100).toFixed(0)}%
        </Chip>
        {!disabled && (
          <Button
            size='sm'
            variant='light'
            onPress={() => {
              setEditValue(field.value?.toString() || '');
              setIsEditing(true);
            }}
            className='text-xs'
            aria-label={`Editar ${label}`}
          >
            Editar
          </Button>
        )}
      </div>
    </div>
  );
};
