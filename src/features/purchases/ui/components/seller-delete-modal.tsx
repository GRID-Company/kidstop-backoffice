'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { ISeller } from '../../domain/types';

interface SellerDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  seller: ISeller | null;
  isLoading?: boolean;
}

export default function SellerDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  seller,
  isLoading = false,
}: SellerDeleteModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Icon icon="lucide:alert-circle" width={20} className="text-danger" />
          <span>Eliminar vendedor</span>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-600">
            ¿Estás seguro de que deseas eliminar a <strong>{seller?.name}</strong>?
          </p>
          <p className="text-xs text-default-400">
            Esta acción no se puede deshacer. Las compras asociadas a este vendedor se mantendrán en el historial.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={handleConfirm}
            isLoading={isLoading}
            startContent={!isLoading && <Icon icon="lucide:trash-2" width={16} />}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
