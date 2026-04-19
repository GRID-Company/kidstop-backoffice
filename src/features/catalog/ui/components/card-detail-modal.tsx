'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
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
import { SubmitHandler } from 'react-hook-form';

import InputForm from '@/shared/base/form-controls/input-form';
import { ICard, ICardVariant } from '../../domain/types';
import {
  CARD_CONDITION_LABELS,
  CARD_CONDITION_SHORT_LABELS,
} from '../../domain/constants';
import { useCardPriceForm } from '../../adapters/forms/use-card-price-form';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import { toCardPriceFormDefaults } from '../../adapters/mappers/card.mapper';

interface CardDetailModalProps {
  card: ICard | null;
  isOpen: boolean;
  onClose: () => void;
  onSyncProvider?: (cardId: string) => void;
  onUpdatePrice?: (variantId: string, data: CardPriceFormData) => void;
}

export default function CardDetailModal({
  card,
  isOpen,
  onClose,
  onSyncProvider,
  onUpdatePrice,
}: CardDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ICardVariant | null>(
    null
  );
  const [isSyncing, setIsSyncing] = useState(false);

  const { control, handleSubmit, formState, reset } = useCardPriceForm();

  useEffect(() => {
    if (card && card.variants.length > 0) {
      setSelectedVariant(card.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [card]);

  useEffect(() => {
    if (selectedVariant) {
      reset(toCardPriceFormDefaults(selectedVariant));
    }
  }, [selectedVariant, reset]);

  const handleVariantSelect = useCallback((variant: ICardVariant) => {
    setSelectedVariant(variant);
  }, []);

  const handleSync = useCallback(async () => {
    if (!card || !onSyncProvider) return;
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSyncProvider(card.id);
    setIsSyncing(false);
  }, [card, onSyncProvider]);

  const handlePriceSubmit: SubmitHandler<CardPriceFormData> = useCallback(
    (data) => {
      if (!selectedVariant || !onUpdatePrice) return;
      onUpdatePrice(selectedVariant.id, data);
    },
    [selectedVariant, onUpdatePrice]
  );

  if (!card) return null;

  const totalStock = card.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">{card.name}</span>
          <span className="text-sm font-normal text-default-500">
            {card.setName} · {card.setCode} · #{card.number}
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-lg bg-default-100">
              {card.imageUrl ? (
                <Image
                  src={card.imageUrl}
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
              <div className="flex items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{
                    base: 'bg-accent/10',
                    content: 'text-accent font-medium',
                  }}
                >
                  {card.tcgType}
                </Chip>
                <Chip size="sm" variant="flat">
                  {card.rarity}
                </Chip>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <span className="text-default-500">Set</span>
                <span className="font-medium">{card.setName}</span>

                <span className="text-default-500">Código</span>
                <span className="font-medium">{card.setCode}</span>

                <span className="text-default-500">Número</span>
                <span className="font-medium">#{card.number}</span>

                <span className="text-default-500">Stock total</span>
                <span className="font-medium">{totalStock}</span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Variantes</h4>
            <div className="flex flex-wrap gap-2">
              {card.variants.map((variant) => (
                <Button
                  key={variant.id}
                  size="sm"
                  variant={
                    selectedVariant?.id === variant.id ? 'solid' : 'bordered'
                  }
                  color="default"
                  className={
                    selectedVariant?.id === variant.id
                      ? 'border-none text-white'
                      : ''
                  }
                  style={
                    selectedVariant?.id === variant.id
                      ? { backgroundColor: 'var(--color-accent)' }
                      : undefined
                  }
                  onPress={() => handleVariantSelect(variant)}
                >
                  {CARD_CONDITION_SHORT_LABELS[variant.condition]} ({variant.stock})
                </Button>
              ))}
            </div>
          </div>

          {selectedVariant && (
            <>
              <Divider />

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold">
                  Detalle de variante —{' '}
                  {CARD_CONDITION_LABELS[selectedVariant.condition]}
                </h4>

                <div className="grid grid-cols-3 gap-4 rounded-lg bg-default-50 p-4 text-sm">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-default-500">Stock</span>
                    <span className="text-lg font-bold">
                      {selectedVariant.stock}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-default-500">Precio compra</span>
                    <span className="text-lg font-bold">
                      ${selectedVariant.buyPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-default-500">Precio venta</span>
                    <span className="text-lg font-bold text-accent">
                      ${selectedVariant.sellPrice.toFixed(2)}
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
                  isDisabled={!formState.isDirty || !formState.isValid}
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

        <DrawerFooter className="flex justify-between">
          <Button
            variant="bordered"
            size="sm"
            isLoading={isSyncing}
            startContent={<Icon icon="lucide:refresh-cw" />}
            onPress={() => void handleSync()}
            className="border-accent text-accent"
          >
            Sincronizar con proveedor
          </Button>
          <Button variant="light" onPress={onClose} className="text-accent">
            Cerrar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
