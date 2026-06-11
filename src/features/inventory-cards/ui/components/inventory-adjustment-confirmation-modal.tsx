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
import { BulkOperationType } from '@/lib/api/schema-types';
import { CARD_CONDITION_LABELS } from '@/lib/types/card.types';
import { BULK_ADJUSTMENT_OPTIONS } from '../../domain/constants';

interface InventoryAdjustmentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  cardName: string;
  condition: string;
  operationType: BulkOperationType;
  quantity: number;
  currentStock: number;
}

export default function InventoryAdjustmentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  cardName,
  condition,
  operationType,
  quantity,
  currentStock,
}: InventoryAdjustmentConfirmationModalProps) {
  const operationLabel = BULK_ADJUSTMENT_OPTIONS.find(
    (opt) => opt.key === operationType
  )?.label ?? operationType;

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
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Icon icon="lucide:alert-circle" className="text-warning" width={20} />
          <span>Confirmar ajuste de inventario</span>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <p className="text-sm text-default-600">
            ¿Confirmas que deseas realizar este ajuste de inventario?
          </p>

          <div className="flex flex-col gap-2 rounded-lg bg-default-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Carta</span>
              <span className="text-sm font-semibold text-accent">
                {cardName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Condición</span>
              <span className="text-sm font-medium">
                {CARD_CONDITION_LABELS[condition as keyof typeof CARD_CONDITION_LABELS] ?? condition}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Operación</span>
              <span className="text-sm font-medium">{operationLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Cantidad</span>
              <Chip size="sm" variant="flat">
                {quantity}
              </Chip>
            </div>
            <div className="flex items-center justify-between border-t border-default-200 pt-2">
              <span className="text-xs text-default-400">Stock actual</span>
              <span className="text-sm font-bold">{currentStock}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Stock resultante</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-accent">
                  {resultingStock}
                </span>
                {stockChange !== 0 && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={stockChange > 0 ? 'success' : 'danger'}
                    startContent={
                      <Icon
                        icon={stockChange > 0 ? 'lucide:arrow-up' : 'lucide:arrow-down'}
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

        <ModalFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent" isDisabled={loading}>
            Cancelar
          </Button>
          <Button
            color="primary"
            isLoading={loading}
            isDisabled={loading}
            startContent={!loading ? <Icon icon="lucide:check" width={18} /> : undefined}
            onPress={onConfirm}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Confirmar ajuste
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
