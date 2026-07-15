'use client';

import Image from 'next/image';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';
import CardImagePreviewModal from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';

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
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  if (!item) return null;

  const { text: qtyText, className: qtyClass } = formatMovementQuantity(item);

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size='md'>
      <DrawerContent>
        <DrawerHeader className='flex flex-col gap-1'>
          <span className='text-accent text-lg font-semibold'>
            Detalle del movimiento
          </span>
          <span className='text-default-500 text-sm font-normal'>
            {formatUnixDateTime(item.createdDate)}
          </span>
        </DrawerHeader>

        <DrawerBody className='flex flex-col gap-6'>
          <div className='bg-default-50 flex items-center gap-4 rounded-lg p-4'>
            <div
              className='bg-default-100 relative h-16 w-12 shrink-0 cursor-pointer overflow-hidden rounded transition-opacity hover:opacity-80'
              onClick={() =>
                openPreview(
                  item.cardImageUrl,
                  item.cardName,
                  item.tcg as 'POKEMON' | 'MAGIC'
                )
              }
              role='button'
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  openPreview(
                    item.cardImageUrl,
                    item.cardName,
                    item.tcg as 'POKEMON' | 'MAGIC'
                  );
                }
              }}
              aria-label={`Ver ${item.cardName} en tamaño completo`}
            >
              {item.cardImageUrl ? (
                <img
                  src={item.cardImageUrl}
                  alt={item.cardName}
                  className='absolute inset-0 h-full w-full object-contain'
                />
              ) : (
                <Image
                  src={
                    item.tcg === 'MAGIC'
                      ? magicCardPlaceholder
                      : pokemonCardPlaceholder
                  }
                  alt='Card placeholder'
                  fill
                  sizes='48px'
                  className='object-contain'
                />
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold'>{item.cardName}</p>
              <p className='text-default-400 truncate text-xs'>
                {item.setName} ({item.setCode}) · #{item.cardNumber}
              </p>
              <p className='text-default-400 mt-1 text-xs'>{item.tcg}</p>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <span className='text-default-500 text-sm'>
                Tipo de movimiento
              </span>
              <Chip
                size='sm'
                variant='flat'
                color={MOVEMENT_TYPE_COLORS[item.movementType] ?? 'default'}
                startContent={
                  <Icon
                    icon={
                      MOVEMENT_TYPE_ICONS[item.movementType] ?? 'lucide:circle'
                    }
                    className='ml-1 text-sm'
                  />
                }
              >
                {MOVEMENT_TYPE_LABELS[item.movementType] ?? item.movementType}
              </Chip>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-default-500 text-sm'>Cantidad</span>
              <span className={`text-sm font-bold ${qtyClass}`}>{qtyText}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-default-500 text-sm'>Usuario</span>
              <span className='text-sm font-medium'>{item.userName}</span>
            </div>

            {item.reference && (
              <div className='flex items-center justify-between'>
                <span className='text-default-500 text-sm'>Referencia</span>
                <span className='text-default-700 text-sm'>
                  {item.reference}
                </span>
              </div>
            )}
          </div>

          {item.notes && (
            <>
              <Divider />
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <Icon
                    icon='lucide:file-text'
                    className='text-default-400 text-sm'
                  />
                  <span className='text-sm font-semibold'>Notas</span>
                </div>
                <p className='bg-default-50 text-default-700 rounded-lg p-3 text-sm'>
                  {item.notes}
                </p>
              </div>
            </>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button
            variant='light'
            onPress={onClose}
            className='text-accent w-full'
          >
            Cerrar
          </Button>
        </DrawerFooter>
      </DrawerContent>
      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />
    </KidstopDrawer>
  );
}
