'use client';

import { useCallback, useMemo } from 'react';
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
import { ISale } from '../../domain/types';
import { getCustomerDisplayName } from '../../adapters/mappers/sale.mapper';

interface CompleteSaleModalProps {
  sale: ISale | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function CompleteSaleModal({
  sale,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: CompleteSaleModalProps) {
  const itemCount = useMemo(
    () => (sale ? sale.items.reduce((sum, item) => sum + item.quantity, 0) : 0),
    [sale]
  );

  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  if (!sale) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Icon icon="lucide:check-circle" className="text-success" width={20} />
          <span>Completar venta</span>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <p className="text-sm text-default-600">
            ¿Confirmas que el cliente recolectó su pedido?
          </p>

          <div className="flex flex-col gap-2 rounded-lg bg-default-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Código</span>
              <span className="text-sm font-semibold text-accent">
                {sale.saleCode}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Cliente</span>
              <span className="text-sm font-medium">
                {getCustomerDisplayName(
                  sale.customer?.name,
                  sale.kioskCustomerName
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Items</span>
              <Chip size="sm" variant="flat">
                {itemCount} {itemCount === 1 ? 'carta' : 'cartas'}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-400">Total</span>
              <span className="text-sm font-bold text-accent">
                {formatCurrency(sale.total)}
              </span>
            </div>
          </div>

          <p className="text-xs text-default-400">
            Al confirmar, el inventario se descontará automáticamente mediante
            lógica FIFO.
          </p>
        </ModalBody>

        <ModalFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>
          <Button
            color="success"
            isLoading={loading}
            startContent={<Icon icon="lucide:check-circle" width={18} />}
            onPress={handleConfirm}
            className="text-white"
          >
            Confirmar entrega
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
