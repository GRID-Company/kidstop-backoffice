'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { BulkOperationType, CardLanguage } from '@/lib/api/schema-types';
import { CARD_CONDITION_LABELS } from '@/lib/types/card.types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { BULK_ADJUSTMENT_OPTIONS } from '../../domain/constants';

interface InventoryAdjustmentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  cardName: string;
  condition: string;
  language: CardLanguage;
  operationType: BulkOperationType;
  quantity: number;
  currentStock: number;
}

/**
 * Custom confirmation modal for inventory adjustments.
 *
 * Note: This is a custom implementation instead of using the shared ConfirmationModal
 * because it requires domain-specific calculations and display of:
 * - Current stock vs resulting stock comparison
 * - Stock change indicators (arrows, colors)
 * - Operation type details (Manual Entry/Exit/Set)
 * - Card condition and quantity breakdown
 * This structured information is critical for inventory accuracy verification.
 */
export default function InventoryAdjustmentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  cardName,
  condition,
  language,
  operationType,
  quantity,
  currentStock,
}: InventoryAdjustmentConfirmationModalProps) {
  const operationLabel =
    BULK_ADJUSTMENT_OPTIONS.find((opt) => opt.key === operationType)?.label ??
    operationType;

  const getResultingStock = () => {
    switch (operationType) {
      case BulkOperationType.ManualEntry:
        return currentStock + quantity;
      case BulkOperationType.ManualExit:
        return currentStock - quantity;
      case BulkOperationType.ManualSet:
        return quantity;
      default:
        return currentStock;
    }
  };

  const resultingStock = getResultingStock();
  const stockChange = resultingStock - currentStock;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalContent>
        <ModalHeader className='flex items-center gap-2'>
          <Icon
            icon='lucide:alert-circle'
            className='text-warning'
            width={20}
          />
          <span>Confirmar ajuste de inventario</span>
        </ModalHeader>

        <ModalBody className='flex flex-col gap-4'>
          <p className='text-default-600 text-sm'>
            ¿Confirmas que deseas realizar este ajuste de inventario?
          </p>

          <div className='bg-default-50 flex flex-col gap-2 rounded-lg p-3'>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Carta</span>
              <span className='text-accent text-sm font-semibold'>
                {cardName}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Condición</span>
              <span className='text-sm font-medium'>
                {CARD_CONDITION_LABELS[
                  condition as keyof typeof CARD_CONDITION_LABELS
                ] ?? condition}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Idioma</span>
              <span className='text-sm font-medium'>
                {LANGUAGE_LABELS[language]}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Operación</span>
              <span className='text-sm font-medium'>{operationLabel}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Cantidad</span>
              <Chip size='sm' variant='flat'>
                {quantity}
              </Chip>
            </div>
            <div className='border-default-200 flex items-center justify-between border-t pt-2'>
              <span className='text-default-400 text-xs'>Stock actual</span>
              <span className='text-sm font-bold'>{currentStock}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Stock resultante</span>
              <div className='flex items-center gap-2'>
                <span className='text-accent text-sm font-bold'>
                  {resultingStock}
                </span>
                {stockChange !== 0 && (
                  <Chip
                    size='sm'
                    variant='flat'
                    color={stockChange > 0 ? 'success' : 'danger'}
                    startContent={
                      <Icon
                        icon={
                          stockChange > 0
                            ? 'lucide:arrow-up'
                            : 'lucide:arrow-down'
                        }
                        width={12}
                      />
                    }
                  >
                    {Math.abs(stockChange)}
                  </Chip>
                )}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className='flex justify-between'>
          <Button
            variant='light'
            onPress={onClose}
            className='text-accent'
            isDisabled={loading}
          >
            Cancelar
          </Button>
          <Button
            color='primary'
            isLoading={loading}
            isDisabled={loading}
            startContent={
              !loading ? <Icon icon='lucide:check' width={18} /> : undefined
            }
            onPress={onConfirm}
            className='text-white'
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Confirmar ajuste
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
