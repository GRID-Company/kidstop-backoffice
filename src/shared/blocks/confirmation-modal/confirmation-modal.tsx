'use client';

import KidstopModal from '@/shared/base/heorui-overrides/modal';
import { Button, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

type ConfirmVariant = 'danger' | 'primary';

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: ConfirmVariant;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'Confirmar',
  confirmVariant = 'primary',
  onConfirm,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <KidstopModal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1 text-center text-lg font-semibold'>
          {title}
        </ModalHeader>
        <ModalBody className='text-center text-sm text-gray-500'>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter className='flex justify-center gap-4'>
          <Button variant='light' onPress={onClose} isDisabled={isLoading} className='text-accent'>
            Cancelar
          </Button>
          <Button
            onPress={onConfirm}
            isLoading={isLoading}
            className="text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </KidstopModal>
  );
}
