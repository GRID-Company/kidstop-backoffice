'use client';

import { Card, CardBody, Button, Chip, Divider, Alert } from '@heroui/react';
import { Icon } from '@iconify/react';
import { IBulkLoadItem } from '../../domain/bulk-lookup.types';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';

interface BulkLoadConfirmationProps {
  items: IBulkLoadItem[];
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function BulkLoadConfirmation({
  items,
  onConfirm,
  isLoading = false,
  error,
}: BulkLoadConfirmationProps) {
  const { reset } = useBulkLookupStore();

  if (items.length === 0) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center py-8">
          <p className="text-default-500">No hay cartas seleccionadas para cargar</p>
        </CardBody>
      </Card>
    );
  }

  const totalValue = items.reduce((sum, item) => sum + item.sellPrice * item.quantity, 0);
  const newItems = items.filter((item) => item.isNew);
  const updatedItems = items.filter((item) => !item.isNew);

  const handleSuccess = () => {
    reset();
  };

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Confirmación de Carga</h3>

          {error && (
            <Alert
              color="danger"
              title="Error"
              description={error}
              startContent={<Icon icon="lucide:alert-circle" />}
              className="mb-4"
            />
          )}

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-default-100">
              <p className="text-xs text-default-500 mb-1">Total de cartas</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-success-50">
              <p className="text-xs text-default-500 mb-1">Nuevas</p>
              <p className="text-2xl font-bold text-success">{newItems.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-warning-50">
              <p className="text-xs text-default-500 mb-1">Actualizadas</p>
              <p className="text-2xl font-bold text-warning">{updatedItems.length}</p>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-4">
            {items.map((item) => (
              <div
                key={`${item.cardGuid}-${item.condition}`}
                className="flex items-center justify-between p-3 rounded-lg border border-default-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{item.cardGuid}</p>
                    <Chip size="sm" variant="flat">
                      {item.condition}
                    </Chip>
                    {item.isNew && (
                      <Chip size="sm" color="success" variant="flat">
                        Nueva
                      </Chip>
                    )}
                  </div>
                  <p className="text-xs text-default-500">
                    {item.quantity} unidades × ${item.sellPrice.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.quantity * item.sellPrice).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Divider className="my-4" />

          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold">Valor total</p>
            <p className="text-2xl font-bold text-success">${totalValue.toFixed(2)}</p>
          </div>

          <div className="flex gap-2">
            <Button
              color="primary"
              startContent={<Icon icon="lucide:upload" />}
              onPress={onConfirm}
              isLoading={isLoading}
              isDisabled={items.length === 0}
              className="flex-1"
            >
              Cargar al inventario
            </Button>
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:undo" />}
              onPress={handleSuccess}
              isDisabled={isLoading}
            >
              Limpiar
            </Button>
          </div>

          <p className="text-xs text-default-500 text-center mt-2">
            ⚠️ Esta acción no se puede deshacer. Verifica los datos antes de confirmar.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
