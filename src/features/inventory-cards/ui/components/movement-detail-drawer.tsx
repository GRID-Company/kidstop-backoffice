'use client';

import Image from 'next/image';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { formatUnixDateTime } from '@/lib/utils/format-date';
import { IInventoryMovement } from '../../domain/types';
import {
  MOVEMENT_TYPE_LABELS,
  MOVEMENT_TYPE_COLORS,
  MOVEMENT_TYPE_ICONS,
  formatMovementQuantity,
} from '../../domain/constants';

interface MovementDetailDrawerProps {
  item: IInventoryMovement | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovementDetailDrawer({
  item,
  isOpen,
  onClose,
}: MovementDetailDrawerProps) {
  if (!item) return null;

  const { text: qtyText, className: qtyClass } = formatMovementQuantity(item);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">Detalle del movimiento</span>
          <span className="text-sm font-normal text-default-500">
            {formatUnixDateTime(item.createdDate)}
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex items-center gap-4 rounded-lg bg-default-50 p-4">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-default-100">
              {item.cardImageUrl ? (
                <Image
                  src={item.cardImageUrl}
                  alt={item.cardName}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">🃏</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.cardName}</p>
              <p className="truncate text-xs text-default-400">
                {item.setName} ({item.setCode}) · #{item.cardNumber}
              </p>
              <p className="mt-1 text-xs text-default-400">{item.tcg}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-500">Tipo de movimiento</span>
              <Chip
                size="sm"
                variant="flat"
                color={MOVEMENT_TYPE_COLORS[item.movementType] ?? 'default'}
                startContent={
                  <Icon
                    icon={MOVEMENT_TYPE_ICONS[item.movementType] ?? 'lucide:circle'}
                    className="ml-1 text-sm"
                  />
                }
              >
                {MOVEMENT_TYPE_LABELS[item.movementType] ?? item.movementType}
              </Chip>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-default-500">Cantidad</span>
              <span className={`text-sm font-bold ${qtyClass}`}>{qtyText}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-default-500">Usuario</span>
              <span className="text-sm font-medium">{item.userName}</span>
            </div>

            {item.reference && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-500">Referencia</span>
                <span className="text-sm text-default-700">{item.reference}</span>
              </div>
            )}
          </div>

          {item.notes && (
            <>
              <Divider />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:file-text" className="text-sm text-default-400" />
                  <span className="text-sm font-semibold">Notas</span>
                </div>
                <p className="rounded-lg bg-default-50 p-3 text-sm text-default-700">
                  {item.notes}
                </p>
              </div>
            </>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button variant="light" onPress={onClose} className="w-full text-accent">
            Cerrar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
