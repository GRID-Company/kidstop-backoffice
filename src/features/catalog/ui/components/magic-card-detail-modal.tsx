'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
  Input,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';
import { useQuery } from '@apollo/client/react';

import InputForm from '@/shared/base/form-controls/input-form';
import { IMagicCard, IMagicCardVariant } from '../../domain/types';
import { CARD_CONDITION_LABELS, CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { useCardPriceForm } from '../../adapters/forms/use-card-price-form';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import { useMagicCardDetail } from '../hooks/use-magic-card-detail';
import { useUpdateInventoryPrice } from '../hooks/use-update-inventory-price';
import { useAdjustInventoryStock } from '../hooks/use-adjust-inventory-stock';
import { MagicCardWithMetricsDocument } from '@/lib/api/generated/catalog-magic.generated';

interface MagicCardDetailModalProps {
  card: IMagicCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MagicCardDetailModal({
  card,
  isOpen,
  onClose,
}: MagicCardDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<IMagicCardVariant | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);

  const { detail, loading: detailLoading, refetch } = useMagicCardDetail(card?.guid ?? null);
  const { handleUpdatePrice, loading: updateLoading } = useUpdateInventoryPrice();
  const { handleAdjustStock, loading: adjustLoading } = useAdjustInventoryStock();

  const { data: metricsData } = useQuery(MagicCardWithMetricsDocument, {
    variables: { guid: card?.guid ?? '' },
    skip: !card?.guid,
    fetchPolicy: 'cache-and-network',
  });

  const { control, handleSubmit, formState, reset } = useCardPriceForm();

  useEffect(() => {
    const variants = detail?.inventoryCards ?? card?.variants ?? [];
    if (variants.length > 0) {
      const nmVariant = variants.find((v) => v.condition === CARD_CONDITIONS.NEAR_MINT);
      setSelectedVariant(nmVariant ?? variants[0]);
    } else if (card?.guid) {
      setSelectedVariant({
        guid: `${card.guid}-${CARD_CONDITIONS.NEAR_MINT}`,
        condition: CARD_CONDITIONS.NEAR_MINT,
        stock: 0,
        purchasePrice: null,
        sellPrice: null,
      });
    } else {
      setSelectedVariant(null);
    }
  }, [detail, card]);

  useEffect(() => {
    if (selectedVariant) {
      reset({
        condition: selectedVariant.condition,
        buyPrice: selectedVariant.purchasePrice ?? 0,
        sellPrice: selectedVariant.sellPrice ?? 0,
      });
    }
  }, [selectedVariant, reset]);

  const handleVariantSelect = useCallback((variant: IMagicCardVariant) => {
    setSelectedVariant(variant);
  }, []);

  const handlePriceSubmit: SubmitHandler<CardPriceFormData> = useCallback(
    async (data) => {
      if (!detail || !selectedVariant) return;

      const isFakeGuid = selectedVariant.guid.includes('-') && selectedVariant.guid.length > 36;
      const existingInventoryItemGuid = isFakeGuid ? undefined : selectedVariant.guid;

      await handleUpdatePrice({
        cardGuid: detail.guid,
        inventoryItemGuid: existingInventoryItemGuid,
        condition: selectedVariant.condition,
        purchasePrice: data.buyPrice,
        sellPrice: data.sellPrice,
        tcgType: 'MAGIC',
      });
      void refetch();
    },
    [detail, selectedVariant, handleUpdatePrice, refetch]
  );

  const handleStockAdjust = useCallback(async () => {
    if (!detail || !selectedVariant || stockAdjustment === 0) return;
    await handleAdjustStock({
      cardGuid: detail.guid,
      condition: selectedVariant.condition,
      quantity: stockAdjustment,
      tcgType: 'MAGIC',
    });
    setStockAdjustment(0);
    void refetch();
  }, [detail, selectedVariant, stockAdjustment, handleAdjustStock, refetch]);

  if (!card) return null;

  const imageUri = detail?.imageUri ?? card.imageUri;
  const name = detail?.name ?? card.name;
  const edition = detail?.edition ?? card.edition;
  const collectorNumber = detail?.collectorNumber ?? card.collectorNumber;
  const rarity = detail?.rarity ?? card.rarity;
  const isFoil = detail?.isFoil ?? card.isFoil;
  const totalStock = detail?.totalStock ?? card.totalStock;
  const variants = detail?.inventoryCards ?? card.variants;

  const variantMetrics = metricsData?.magicCardWithMetrics?.variantsMetrics?.find(
    (v) => v?.condition === selectedVariant?.condition
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">{name}</span>
          <div className="flex items-center gap-2 text-sm font-normal text-default-500">
            {edition && <span>{edition}</span>}
            {collectorNumber && (
              <>
                <span>·</span>
                <span>#{collectorNumber}</span>
              </>
            )}
          </div>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative aspect-3/4 w-40 shrink-0 overflow-hidden rounded-lg bg-default-100">
              {imageUri ? (
                <img
                  src={imageUri}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-contain p-1"
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
                  Magic
                </Chip>
                {rarity && (
                  <Chip size="sm" variant="flat">
                    {rarity}
                  </Chip>
                )}
                {isFoil && (
                  <Chip
                    size="sm"
                    variant="flat"
                    startContent={<Icon icon="lucide:sparkles" className="text-xs" />}
                    classNames={{
                      base: 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20',
                      content: 'text-amber-600 font-semibold',
                    }}
                  >
                    Foil
                  </Chip>
                )}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {edition && (
                  <>
                    <span className="text-default-500">Edición</span>
                    <span className="font-medium">{edition}</span>
                  </>
                )}

                {collectorNumber && (
                  <>
                    <span className="text-default-500">Número</span>
                    <span className="font-medium">#{collectorNumber}</span>
                  </>
                )}

                <span className="text-default-500">Stock total</span>
                <span className="font-medium">{totalStock}</span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Variantes por condición</h4>
            <div className="flex flex-wrap gap-2">
              {Object.values(CARD_CONDITIONS).map((condition) => {
                const existing = variants.find((v) => v.condition === condition);
                const variant: IMagicCardVariant = existing ?? {
                  guid: `${card?.guid}-${condition}`,
                  condition,
                  stock: 0,
                  purchasePrice: null,
                  sellPrice: null,
                };
                const isSelected = selectedVariant?.condition === condition;
                return (
                  <Button
                    key={condition}
                    size="sm"
                    variant={isSelected ? 'solid' : 'bordered'}
                    color="default"
                    className={isSelected ? 'border-none text-white' : ''}
                    style={
                      isSelected ? { backgroundColor: 'var(--color-accent)' } : undefined
                    }
                    onPress={() => handleVariantSelect(variant)}
                  >
                    {CARD_CONDITION_SHORT_LABELS[condition as keyof typeof CARD_CONDITION_SHORT_LABELS]} ({variant.stock})
                  </Button>
                );
              })}
            </div>
          </div>

          {selectedVariant && (
            <>
              <Divider />

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold">
                  Detalle — {CARD_CONDITION_LABELS[selectedVariant.condition as keyof typeof CARD_CONDITION_LABELS]}
                </h4>

                <div className="grid grid-cols-3 gap-4 rounded-lg bg-default-50 p-4 text-sm">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-default-500">Stock</span>
                    <span className="text-lg font-bold">{selectedVariant.stock}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-default-500">Precio compra</span>
                    <span className="text-lg font-bold">
                      ${(selectedVariant.purchasePrice ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-default-500">Precio venta</span>
                    <span className="text-lg font-bold text-accent">
                      ${(selectedVariant.sellPrice ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {variantMetrics && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-default-500">Última venta</span>
                      <span className="font-medium">
                        {variantMetrics.lastSellDate
                          ? new Date(variantMetrics.lastSellDate as number).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-default-500">Días en inventario</span>
                      <span className="font-medium">
                        {variantMetrics.avgDaysInInventory ?? 0} días
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-default-500">En wishlist</span>
                      <span className="font-medium">{variantMetrics.wishlistCount ?? 0}</span>
                    </div>
                  </div>
                )}
              </div>

              {metricsData?.magicCardWithMetrics && (
                <>
                  <Divider />
                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold">Precios de mercado (MXN)</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-default-500">Precio retail</span>
                        <span className="font-bold text-green-600">
                          {metricsData.magicCardWithMetrics.priceRetail
                            ? `$${metricsData.magicCardWithMetrics.priceRetail.toFixed(2)}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-default-500">Precio compra</span>
                        <span className="font-bold text-blue-600">
                          {metricsData.magicCardWithMetrics.priceBuy
                            ? `$${metricsData.magicCardWithMetrics.priceBuy.toFixed(2)}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-default-500">Precio referencia</span>
                        <span className="font-bold text-accent">
                          {metricsData.magicCardWithMetrics.priceBuy
                            ? `$${metricsData.magicCardWithMetrics.priceBuy.toFixed(2)}`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Divider />

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold">Ajustar stock</h4>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    size="sm"
                    label="Cantidad (+/-)"
                    value={String(stockAdjustment)}
                    onValueChange={(val) => setStockAdjustment(parseInt(val, 10) || 0)}
                    classNames={{ inputWrapper: 'border-[1px] bg-white' }}
                  />
                  <Button
                    size="sm"
                    color="primary"
                    isDisabled={stockAdjustment === 0}
                    isLoading={adjustLoading}
                    onPress={handleStockAdjust}
                    startContent={<Icon icon="lucide:package-plus" />}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>

              <Divider />

              <form
                onSubmit={(...args) => {
                  void handleSubmit(handlePriceSubmit)(...args);
                }}
                className="flex flex-col gap-4"
              >
                <h4 className="text-sm font-semibold">Editar precios</h4>

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
                  isLoading={updateLoading}
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
