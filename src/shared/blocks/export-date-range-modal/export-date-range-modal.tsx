'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Chip,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { parseDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';

import KidstopModal from '@/shared/base/heorui-overrides/modal';
import DateRangePicker from '@/shared/base/heorui-overrides/date-range-picker';
import {
  EXPORT_QUICK_ACTION_OPTIONS,
  ExportDateRange,
  ExportQuickAction,
  getQuickActionRange,
  toExportDateRange,
} from './export-date-range-modal.utils';

interface ExportDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (range: ExportDateRange | undefined) => void;
  title: string;
  activeFilters?: string[];
  initialRange?: { start: string; end: string };
}

export default function ExportDateRangeModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  activeFilters,
  initialRange,
}: ExportDateRangeModalProps) {
  const [action, setAction] = useState<ExportQuickAction>('all');
  const [range, setRange] = useState<RangeValue<DateValue> | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialRange) {
      setAction('custom');
      setRange({
        start: parseDate(initialRange.start),
        end: parseDate(initialRange.end),
      });
      return;
    }

    setAction('all');
    setRange(null);
  }, [isOpen, initialRange]);

  const handleQuickAction = useCallback((selected: ExportQuickAction) => {
    setAction(selected);

    if (selected === 'all' || selected === 'custom') return;

    setRange(getQuickActionRange(selected));
  }, []);

  const handleRangeChange = useCallback(
    (value: RangeValue<DateValue> | null) => {
      setRange(value);
      setAction('custom');
    },
    []
  );

  const handleConfirm = useCallback(() => {
    onConfirm(
      action === 'all' || !range ? undefined : toExportDateRange(range)
    );
    onClose();
  }, [action, range, onConfirm, onClose]);

  const isConfirmDisabled = action !== 'all' && !range;

  return (
    <KidstopModal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className='flex items-center gap-2'>
          <Icon
            icon='solar:download-minimalistic-bold'
            className='text-accent'
            width={20}
          />
          <span>{title}</span>
        </ModalHeader>

        <ModalBody className='flex flex-col gap-4'>
          {!!activeFilters?.length && (
            <div className='flex flex-col gap-2'>
              <span className='text-default-500 text-xs'>
                Se aplicarán los filtros actuales:
              </span>
              <div className='flex flex-wrap gap-2'>
                {activeFilters.map((filter) => (
                  <Chip key={filter} size='sm' variant='flat'>
                    {filter}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <span className='text-default-500 text-xs'>Rango de fechas</span>
            <div className='flex flex-wrap gap-2'>
              {EXPORT_QUICK_ACTION_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  size='sm'
                  variant={action === option.value ? 'solid' : 'flat'}
                  className={
                    action === option.value ? 'bg-accent text-white' : ''
                  }
                  onPress={() => handleQuickAction(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {action === 'all' ? (
            <p className='text-default-400 text-sm'>
              Se exportará todo el historial.
            </p>
          ) : (
            <DateRangePicker
              label='Desde - Hasta'
              value={range}
              onChange={handleRangeChange}
              aria-label='Seleccionar rango de fechas'
            />
          )}
        </ModalBody>

        <ModalFooter className='flex justify-end gap-4'>
          <Button variant='light' onPress={onClose} className='text-accent'>
            Cancelar
          </Button>
          <Button
            className='bg-accent text-white'
            isDisabled={isConfirmDisabled}
            startContent={
              <Icon icon='solar:download-minimalistic-bold' width={16} />
            }
            onPress={handleConfirm}
          >
            Exportar
          </Button>
        </ModalFooter>
      </ModalContent>
    </KidstopModal>
  );
}
