'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Modal, ModalContent, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';

interface CardImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  alt: string;
  tcgType: 'POKEMON' | 'MAGIC';
}

export function CardImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  alt,
  tcgType,
}: CardImagePreviewModalProps) {
  const placeholder =
    tcgType === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder;

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='full'
      hideCloseButton
      classNames={{
        base: 'bg-black/95 backdrop-blur-sm h-(--vv-height) min-h-0',
        wrapper:
          'items-center justify-center translate-y-(--visual-viewport-offset-top)',
        backdrop: 'translate-y-(--visual-viewport-offset-top)',
        body: 'p-0',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <Button
              isIconOnly
              variant='light'
              onPress={onClose}
              className='absolute top-4 right-4 z-50 bg-white/10 text-white hover:bg-white/20'
              aria-label='Cerrar previsualizador'
            >
              <Icon icon='lucide:x' width={24} />
            </Button>

            <div
              className='flex h-full w-full items-center justify-center p-8'
              onClick={onClose}
            >
              <div
                className='relative flex max-h-[calc(var(--vv-height)*0.9)] max-w-[90vw] items-center justify-center'
                onClick={(e) => e.stopPropagation()}
              >
                {imageUrl && !hasError ? (
                  <img
                    src={imageUrl}
                    alt={alt}
                    className='max-h-[calc(var(--vv-height)*0.9)] max-w-[90vw] object-contain'
                    loading='eager'
                    onError={() => setHasError(true)}
                  />
                ) : (
                  <div className='relative h-[calc(var(--vv-height)*0.9)] w-[calc(var(--vv-height)*0.9*3/4)]'>
                    <Image
                      src={placeholder}
                      alt={`${tcgType} card placeholder`}
                      fill
                      className='object-contain'
                      priority
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
