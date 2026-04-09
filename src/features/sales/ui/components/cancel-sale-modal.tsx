'use client';

import { useCallback, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { CancelReason } from '../../domain/types';
import { CANCEL_REASON_OPTIONS } from '../../domain/constants';

interface CancelSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: CancelReason) => void;
  loading?: boolean;
}

export default function CancelSaleModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: CancelSaleModalProps) {
  const [selectedReason, setSelectedReason] = useState<CancelReason | null>(
    null
  );

  const handleConfirm = useCallback(() => {
    if (!selectedReason) return;
    onConfirm(selectedReason);
  }, [selectedReason, onConfirm]);

  const handleClose = useCallback(() => {
    setSelectedReason(null);
    onClose();
  }, [onClose]);

  const handleReasonChange = useCallback((keys: unknown) => {
    const selected = Array.from(keys as Set<string>)[0] as CancelReason;
    setSelectedReason(selected || null);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Icon icon="lucide:x-circle" className="text-danger" width={20} />
          <span>Cancelar pedido</span>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <p className="text-sm text-default-600">
            Selecciona el motivo de cancelación del pedido.
          </p>

          <Select
            label="Motivo de cancelación"
            placeholder="Selecciona un motivo"
            selectedKeys={selectedReason ? new Set([selectedReason]) : new Set()}
            onSelectionChange={handleReasonChange}
            isRequired
          >
            {CANCEL_REASON_OPTIONS.map((option) => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </ModalBody>

        <ModalFooter className="flex justify-between">
          <Button variant="light" onPress={handleClose} className="text-accent">
            Volver
          </Button>
          <Button
            color="danger"
            variant="flat"
            isLoading={loading}
            isDisabled={!selectedReason}
            startContent={<Icon icon="lucide:x-circle" width={18} />}
            onPress={handleConfirm}
          >
            Confirmar cancelación
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
