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
import { IPokemonCard, IPokemonCardVariant, CardCondition } from '../../domain/types';
import { CARD_CONDITION_LABELS, CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';
import { useState, useCallback, useEffect } from 'react';

interface PokemonCardDetailModalProps {
  card: IPokemonCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PokemonCardDetailModal({
  card,
  isOpen,
  onClose,
}: PokemonCardDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<IPokemonCardVariant | null>(null);

  useEffect(() => {
    if (card && card.variants.length > 0) {
      setSelectedVariant(card.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [card]);

  const handleVariantSelect = useCallback((variant: IPokemonCardVariant) => {
    setSelectedVariant(variant);
  }, []);

  if (!card) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">{card.name}</span>
          {(card.setName || card.setCode) && (
            <span className="text-sm font-normal text-default-500">
              {[card.setName, card.setCode].filter(Boolean).join(' · ')}
            </span>
          )}
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-lg bg-default-100">
              {card.imageUri ? (
                <Image
                  src={card.imageUri}
                  alt={card.name}
                  fill
                  sizes="160px"
                  className="object-contain p-1"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-default-400">
                  <span className="text-5xl">🃏</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {card.setName && (
                  <>
                    <span className="text-default-500">Set</span>
                    <span className="font-medium">{card.setName}</span>
                  </>
                )}
                {card.setCode && (
                  <>
                    <span className="text-default-500">Código</span>
                    <span className="font-medium">{card.setCode}</span>
                  </>
                )}
                <span className="text-default-500">Stock total</span>
                <span className="font-medium">{card.totalStock}</span>
                {card.sellPrice !== null && (
                  <>
                    <span className="text-default-500">Precio venta</span>
                    <span className="font-medium text-success">${card.sellPrice.toFixed(2)}</span>
                  </>
                )}
                <span className="text-default-500">Disponible</span>
                <Chip
                  size="sm"
                  variant="flat"
                  color={card.availableStock ? 'success' : 'default'}
                >
                  {card.availableStock ? 'Sí' : 'No'}
                </Chip>
              </div>
            </div>
          </div>

          {card.variants.length > 0 && (
            <>
              <Divider />

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold">Variantes por condición</h4>
                <div className="flex flex-wrap gap-2">
                  {card.variants.map((variant, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant={selectedVariant === variant ? 'solid' : 'bordered'}
                      color="default"
                      className={selectedVariant === variant ? 'border-none text-white' : ''}
                      style={
                        selectedVariant === variant
                          ? { backgroundColor: 'var(--color-accent)' }
                          : undefined
                      }
                      onPress={() => handleVariantSelect(variant)}
                    >
                      {CARD_CONDITION_SHORT_LABELS[variant.condition as CardCondition] ??
                        variant.condition}{' '}
                      ({variant.stock})
                    </Button>
                  ))}
                </div>
              </div>

              {selectedVariant && (
                <>
                  <Divider />

                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold">
                      Detalle —{' '}
                      {CARD_CONDITION_LABELS[selectedVariant.condition as CardCondition] ??
                        selectedVariant.condition}
                    </h4>

                    <div className="grid grid-cols-3 gap-4 rounded-lg bg-default-50 p-4 text-sm">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-default-500">Stock</span>
                        <span className="text-lg font-bold">{selectedVariant.stock}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-default-500">Precio compra</span>
                        <span className="text-lg font-bold">
                          {selectedVariant.purchasePrice !== null
                            ? `$${selectedVariant.purchasePrice.toFixed(2)}`
                            : '—'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-default-500">Precio venta</span>
                        <span className="text-lg font-bold text-accent">
                          {selectedVariant.sellPrice !== null
                            ? `$${selectedVariant.sellPrice.toFixed(2)}`
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </DrawerBody>

        <DrawerFooter className="flex justify-end">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cerrar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
