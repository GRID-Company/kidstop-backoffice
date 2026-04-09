'use client';

import { useState, useCallback, useEffect } from 'react';
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
  Skeleton,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';
import InputForm from '@/shared/base/form-controls/input-form';
import { IPokemonCard, CardCondition } from '../../domain/types';
import { CARD_CONDITION_LABELS, CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';
import { usePokemonCardDetail } from '../hooks/use-pokemon-card-detail';
import { useUpdateInventoryPrice } from '../hooks/use-update-inventory-price';
import { useCardPriceForm } from '../../adapters/forms/use-card-price-form';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import { toCardPriceFormDefaults } from '../../adapters/mappers/card.mapper';

interface InventoryCard {
  condition: string;
  stock: number;
  purchasePrice: number | null;
  sellPrice: number | null;
}

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
  const { detail, loading } = usePokemonCardDetail(isOpen ? (card?.guid ?? null) : null);
  const [selectedVariant, setSelectedVariant] = useState<InventoryCard | null>(null);
  const { handleUpdatePrice, loading: updatingPrice } = useUpdateInventoryPrice();
  const { control, handleSubmit, formState, reset } = useCardPriceForm();

  useEffect(() => {
    if (detail?.inventoryCards && detail.inventoryCards.length > 0) {
      setSelectedVariant(detail.inventoryCards[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [detail]);

  useEffect(() => {
    if (selectedVariant) {
      reset(
        toCardPriceFormDefaults({
          id: selectedVariant.condition,
          condition: selectedVariant.condition as CardCondition,
          stock: selectedVariant.stock,
          buyPrice: selectedVariant.purchasePrice ?? 0,
          sellPrice: selectedVariant.sellPrice ?? 0,
        })
      );
    }
  }, [selectedVariant, reset]);

  const handleVariantSelect = useCallback((variant: InventoryCard) => {
    setSelectedVariant(variant);
  }, []);

  const handlePriceSubmit: SubmitHandler<CardPriceFormData> = useCallback(
    async (data) => {
      if (!detail || !selectedVariant) return;
      await handleUpdatePrice({
        cardGuid: detail.guid,
        condition: selectedVariant.condition,
        purchasePrice: data.buyPrice,
        sellPrice: data.sellPrice,
        tcgType: 'POKEMON',
      });
    },
    [detail, selectedVariant, handleUpdatePrice]
  );

  if (!card) return null;

  const imageUri = detail?.imageUri ?? card.imageUri;
  const name = detail?.name ?? card.name;
  const setName = detail?.setName ?? card.setName;
  const setCode = detail?.setCode ?? card.setCode;
  const totalStock = detail?.totalStock ?? card.totalStock;
  const sellPrice = detail?.sellPrice ?? card.sellPrice;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">{name}</span>
          <span className="text-sm font-normal text-default-500">
            {[setName, setCode].filter(Boolean).join(' · ')}
            {detail?.cardNumber ? ` · ${detail.cardNumber}` : ''}
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative aspect-3/4 w-40 shrink-0 overflow-hidden rounded-lg bg-default-100">
              {imageUri ? (
                <Image
                  src={imageUri}
                  alt={name}
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
                {setName && (
                  <>
                    <span className="text-default-500">Set</span>
                    <span className="font-medium">{setName}</span>
                  </>
                )}
                {setCode && (
                  <>
                    <span className="text-default-500">Código</span>
                    <span className="font-medium">{setCode}</span>
                  </>
                )}
                {loading ? (
                  <>
                    <span className="text-default-500">Número</span>
                    <Skeleton className="h-4 w-12 rounded" />
                  </>
                ) : detail?.cardNumber ? (
                  <>
                    <span className="text-default-500">Número</span>
                    <span className="font-medium">{detail.cardNumber}</span>
                  </>
                ) : null}
                {loading ? (
                  <>
                    <span className="text-default-500">Rareza</span>
                    <Skeleton className="h-4 w-20 rounded" />
                  </>
                ) : detail?.rarity ? (
                  <>
                    <span className="text-default-500">Rareza</span>
                    <span className="font-medium">{detail.rarity}</span>
                  </>
                ) : null}
                {!loading && detail?.variant && (
                  <>
                    <span className="text-default-500">Variante</span>
                    <span className="font-medium">{detail.variant}</span>
                  </>
                )}
                <span className="text-default-500">Stock total</span>
                <span className="font-medium">{totalStock}</span>
                {sellPrice !== null && (
                  <>
                    <span className="text-default-500">Precio venta</span>
                    <span className="font-medium text-success">${sellPrice?.toFixed(2)}</span>
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

          <Divider />

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Variantes</h4>
            {loading ? (
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ) : detail?.inventoryCards && detail.inventoryCards.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {detail.inventoryCards.map((variant, idx) => (
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
            ) : (
              <p className="text-sm text-default-400">Sin variantes registradas</p>
            )}
          </div>

          {selectedVariant && (
            <>
              <Divider />

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold">
                  Detalle de variante —{' '}
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

              <Divider />

              <form
                onSubmit={(...args) => {
                  void handleSubmit(handlePriceSubmit)(...args);
                }}
                className="flex flex-col gap-4"
              >
                <h4 className="text-sm font-semibold">Editar precio público</h4>

                <div className="grid grid-cols-2 gap-4">
                  <InputForm
                    label="Precio de compra"
                    type="number"
                    controlProps={{ control, name: 'buyPrice' }}
                  />
                  <InputForm
                    label="Precio de venta"
                    type="number"
                    controlProps={{ control, name: 'sellPrice' }}
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  isDisabled={!formState.isDirty || !formState.isValid || updatingPrice}
                  isLoading={updatingPrice}
                  startContent={<Icon icon="lucide:save" />}
                  className="text-white"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  Guardar precios
                </Button>
              </form>
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
