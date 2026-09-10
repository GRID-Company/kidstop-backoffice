'use client';

import { useCallback } from 'react';
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
import { formatCurrency } from '@/lib/utils/format-currency';
import { IPurchase, IPaymentDetail } from '../../domain/types';

interface CompletePurchaseModalProps {
  purchase: IPurchase | null;
  itemCount: number;
  payments: IPaymentDetail[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

/**
 * Custom confirmation modal for completing a purchase.
 *
 * Note: This is a custom implementation instead of using the shared ConfirmationModal
 * because it requires domain-specific layout to display purchase details (reference,
 * seller, item count, total paid) in a structured format that helps users verify
 * the purchase information before finalizing.
 */
export default function CompletePurchaseModal({
  purchase,
  itemCount,
  payments,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: CompletePurchaseModalProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  if (!purchase) return null;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalContent>
        <ModalHeader className='flex items-center gap-2'>
          <Icon
            icon='lucide:check-circle'
            className='text-success'
            width={20}
          />
          <span>Finalizar compra</span>
        </ModalHeader>

        <ModalBody className='flex flex-col gap-4'>
          <p className='text-default-600 text-sm'>
            ¿Confirmas que deseas finalizar esta compra y registrarla en
            inventario?
          </p>

          <div className='bg-default-50 flex flex-col gap-2 rounded-lg p-3'>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Referencia</span>
              <span className='text-accent text-sm font-semibold'>
                {purchase.reference}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Vendedor</span>
              <span className='text-sm font-medium'>
                {purchase.seller.name}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Items</span>
              <Chip size='sm' variant='flat'>
                {itemCount} {itemCount === 1 ? 'carta' : 'cartas'}
              </Chip>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-default-400 text-xs'>Total pagado</span>
              <span className='text-accent text-sm font-bold'>
                {formatCurrency(totalPaid)}
              </span>
            </div>
          </div>

          <p className='text-default-400 text-xs'>
            Al confirmar, las cartas se registrarán automáticamente en el
            inventario con los precios de venta configurados.
          </p>
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
            color='success'
            isLoading={loading}
            isDisabled={loading}
            startContent={
              !loading ? (
                <Icon icon='lucide:check-circle' width={18} />
              ) : undefined
            }
            onPress={handleConfirm}
            className='text-white'
          >
            Confirmar finalización
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
