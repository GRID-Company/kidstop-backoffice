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
  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={!isLoading}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            Eliminar vendedor
          </span>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-default-600">
              ¿Estás seguro de que deseas eliminar al vendedor{' '}
              <span className="font-semibold text-accent">{seller?.name}</span>?
            </p>
            <p className="text-xs text-default-500">
              Esta acción es irreversible. Los datos del vendedor se marcarán como eliminados pero se preservarán para las compras existentes.
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={isLoading}
            className="text-accent"
          >
            Cancelar
          </Button>
          <Button
            onPress={onConfirm}
            isLoading={isLoading}
            startContent={!isLoading && <Icon icon="lucide:trash-2" />}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
