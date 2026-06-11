'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';
import { useQuery } from '@apollo/client/react';

import InputForm from '@/shared/base/form-controls/input-form';
import FoilChip from '@/shared/components/foil-chip';
import { IMagicCard } from '../../domain/types';
import { CARD_CONDITION_LABELS, CARD_CONDITION_SHORT_LABELS, CARD_CONDITIONS } from '../../domain/constants';
import { useMagicCardDetail } from '../hooks/use-magic-card-detail';
import { useCardDetailModal, InventoryCard } from '../hooks/use-card-detail-modal';
import { MagicCardWithMetricsDocument, MagicCardInternalListDocument } from '@/lib/api/generated/catalog-magic.generated';
import { BulkOperationType } from '@/lib/api/schema-types';
import { BULK_ADJUSTMENT_OPTIONS } from '@/features/inventory-cards/domain/constants';
import InventoryAdjustmentConfirmationModal from '@/features/inventory-cards/ui/components/inventory-adjustment-confirmation-modal';
import { toMagicCard } from '../../adapters/mappers/card.mapper';
import { CARD_CONDITION_OPTIONS } from '@/lib/types/card.types';

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
  const [selectedCard, setSelectedCard] = useState<IMagicCard | null>(card);
  const [itemSearch, setItemSearch] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  
  useEffect(() => {
    if (isOpen) {
      setSelectedCard(card);
      setItemSearch('');
      setSelectedCondition('');
    }
  }, [isOpen, card]);

  const { detail, loading: detailLoading, refetch } = useMagicCardDetail(isOpen ? (selectedCard?.guid ?? null) : null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    selectedVariant,
    stockAdjustment,
    setStockAdjustment,
    movementType,
    setMovementType,
    handleVariantSelect,
    handlePriceSubmit,
    executeStockAdjust,
    control,
    handleSubmit,
    formState,
    updatingPrice,
    adjustLoading,
    cardName,
  } = useCardDetailModal({
    detail,
    card: selectedCard,
    tcgType: 'MAGIC',
    onRefetch: refetch,
  });

  useEffect(() => {
    if (selectedCondition && detail?.inventoryCards) {
      const variant = detail.inventoryCards.find(v => v.condition === selectedCondition);
      if (variant) {
        handleVariantSelect(variant);
      }
    }
  }, [selectedCondition, detail, handleVariantSelect]);

  const handleStockAdjustClick = useCallback(() => {
    if (stockAdjustment === 0) return;
    setIsConfirmModalOpen(true);
  }, [stockAdjustment]);

  const handleConfirmAdjustment = useCallback(async () => {
    await executeStockAdjust();
    setIsConfirmModalOpen(false);
  }, [executeStockAdjust]);

  const { data: searchData, loading: searchLoading } = useQuery(MagicCardInternalListDocument, {
    variables: {
      findMagicCardsPublicArgs: {
        skip: 0,
        limit: 6,
        search: itemSearch.trim() || undefined,
        sort: { column: 'releaseDate', order: 'DESC' },
        filters: {},
      },
    },
    skip: !!selectedCard || itemSearch.trim().length < 2,
    fetchPolicy: 'network-only',
  });

  const searchResults = useMemo<IMagicCard[]>(() => {
    const raw = searchData?.magicCardInternalList?.data;
    if (!raw) return [];
    return raw
      .filter((card): card is NonNullable<typeof card> => card != null)
      .map(toMagicCard);
  }, [searchData]);

  const handleCardSelect = useCallback((card: IMagicCard) => {
    setSelectedCard(card);
    setSelectedCondition('');
  }, []);

  const handleConditionSelect = useCallback((condition: string) => {
    setSelectedCondition(condition);
    setItemSearch('');
  }, []);

  const { data: metricsData } = useQuery(MagicCardWithMetricsDocument, {
    variables: { guid: selectedCard?.guid ?? '' },
    skip: !selectedCard?.guid || !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  const imageUri = detail?.imageUri ?? selectedCard?.imageUri;
  const name = detail?.name ?? selectedCard?.name;
  const edition = detail?.edition ?? selectedCard?.edition;
  const collectorNumber = detail?.collectorNumber ?? selectedCard?.collectorNumber;
  const rarity = detail?.rarity ?? selectedCard?.rarity;
  const isFoil = detail?.isFoil ?? selectedCard?.isFoil;
  const totalStock = detail?.totalStock ?? selectedCard?.totalStock;
  const variants = detail?.inventoryCards ?? selectedCard?.variants ?? [];

  const variantMetrics = metricsData?.magicCardWithMetrics?.variantsMetrics?.find(
    (v) => v?.condition === selectedVariant?.condition
  );

  return (
    <>
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size="xl">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">{name ?? 'Ajuste de inventario'}</span>
          <div className="flex items-center gap-2 text-sm font-normal text-default-500">
            {selectedCard && !selectedCondition ? (
              <>
                {edition && <span>{edition}</span>}
                {collectorNumber && (
                  <>
                    <span>·</span>
                    <span>#{collectorNumber}</span>
                  </>
                )}
              </>
            ) : selectedCard && selectedCondition ? (
              <span>Selecciona la condición de la carta</span>
            ) : (
              <span>Buscar carta por nombre, edición o código</span>
            )}
          </div>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          {!selectedCard && (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Buscar carta por nombre, edición o código..."
                value={itemSearch}
                onValueChange={setItemSearch}
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                isClearable
                onClear={() => setItemSearch('')}
                autoFocus
              />

              {searchLoading && (
                <div className="flex justify-center py-4">
                  <Spinner size="sm" />
                </div>
              )}

              {!searchLoading && itemSearch.trim().length >= 2 && searchResults.length === 0 && (
                <p className="text-center text-sm text-default-400">
                  No se encontraron cartas en el catálogo
                </p>
              )}

              {searchResults.length > 0 && (
                <div className="flex flex-col gap-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.guid}
                      type="button"
                      onClick={() => handleCardSelect(result)}
                      className="flex items-center gap-3 rounded-lg border border-default-200 p-3 text-left transition hover:bg-default-50"
                    >
                      <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded bg-default-100">
                        {result.imageUri ? (
                          <img
                            src={result.imageUri}
                            alt={result.name}
                            className="absolute inset-0 h-full w-full object-contain"
                          />
                        ) : (
                          <Image
                            src={magicCardPlaceholder}
                            alt="Card placeholder"
                            fill
                            sizes="32px"
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{result.name}</p>
                        <p className="truncate text-xs text-default-500">
                          {result.edition} · #{result.collectorNumber}
                        </p>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={result.totalStock > 0 ? 'success' : 'default'}
                      >
                        {result.totalStock}
                      </Chip>
                    </button>
                  ))}
                </div>
              )}

              {itemSearch.trim().length < 2 && (
                <p className="text-center text-sm text-default-400">
                  Escribe al menos 2 caracteres para buscar
                </p>
              )}
            </div>
          )}

          {selectedCard && !selectedCondition && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 rounded-lg bg-default-50 p-4">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-default-100">
                  {selectedCard.imageUri ? (
                    <img
                      src={selectedCard.imageUri}
                      alt={selectedCard.name}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={magicCardPlaceholder}
                      alt="Card placeholder"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-sm font-semibold">{selectedCard.name}</p>
                  <p className="truncate text-xs text-default-500">
                    {selectedCard.edition} · #{selectedCard.collectorNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => { setSelectedCard(null); setItemSearch(''); }}
                  className="self-start text-default-400 hover:text-default-700"
                  aria-label="Cambiar carta"
                >
                  <Icon icon="lucide:x" />
                </button>
              </div>

              <Divider />

              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Selecciona la condición</p>
                <div className="grid grid-cols-2 gap-2">
                  {CARD_CONDITION_OPTIONS.map((option) => {
                    const variant = selectedCard.variants.find(v => v.condition === option.value);
                    const stock = variant?.stock ?? 0;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleConditionSelect(option.value)}
                        className="flex items-center justify-between rounded-lg border border-default-200 p-3 text-left transition hover:bg-default-50"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">{option.label}</p>
                          <p className="text-xs text-default-500">Stock: {stock}</p>
                        </div>
                        <Icon icon="lucide:chevron-right" className="text-default-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {selectedCard && selectedCondition && (
          <>
          <div className="flex gap-6">
            <div className="relative aspect-3/4 w-40 shrink-0 overflow-hidden rounded-lg bg-default-100">
              {imageUri ? (
                <img
                  src={imageUri}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-contain p-1"
                />
              ) : (
                <Image
                  src={magicCardPlaceholder}
                  alt="Magic card placeholder"
                  fill
                  sizes="160px"
                  className="object-contain p-1"
                />
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
                  <FoilChip label="Foil" variant="subtle" />
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
                const variant: InventoryCard = existing ?? {
                  guid: `${card?.guid}-${condition}`,
                  isNew: true,
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
                <Select
                  label="Tipo de operación"
                  placeholder="Selecciona el tipo de operación"
                  selectedKeys={[movementType]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as BulkOperationType;
                    setMovementType(selected);
                  }}
                  size="sm"
                >
                  {BULK_ADJUSTMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.key} description={option.description}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    size="sm"
                    label="Cantidad"
                    value={String(stockAdjustment)}
                    onValueChange={(val) => setStockAdjustment(parseInt(val, 10) || 0)}
                    classNames={{ inputWrapper: 'border-[1px] bg-white' }}
                  />
                  <Button
                    size="sm"
                    isDisabled={stockAdjustment === 0}
                    onPress={handleStockAdjustClick}
                    startContent={<Icon icon="lucide:package-plus" />}
                    className="text-white"
                    style={{ backgroundColor: 'var(--color-accent)' }}
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
          </>
          )}
        </DrawerBody>

        <DrawerFooter className="flex justify-end">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cerrar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </KidstopDrawer>

    {selectedVariant && (
      <InventoryAdjustmentConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAdjustment}
        loading={adjustLoading}
        cardName={cardName ?? name}
        condition={selectedVariant.condition}
        operationType={movementType}
        quantity={stockAdjustment}
        currentStock={selectedVariant.stock}
      />
    )}
  </>
  );
}
