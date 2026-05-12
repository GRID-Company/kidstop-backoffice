'use client';

import Image from 'next/image';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
  Skeleton,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';
import InputForm from '@/shared/base/form-controls/input-form';
import FoilChip from '@/shared/components/foil-chip';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import { formatReleaseDate } from '@/lib/utils/format-date';
import { getHighestQualityImage } from '@/lib/utils/image-utils';
import { IPokemonCard, CardCondition } from '../../domain/types';
import { CARD_CONDITION_LABELS, CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { usePokemonCardDetail } from '../hooks/use-pokemon-card-detail';
import { useCardDetailModal, InventoryCard } from '../hooks/use-card-detail-modal';
import { useQuery } from '@apollo/client/react';
import { PokemonCardWithMetricsDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { BulkOperationType } from '@/lib/api/schema-types';
import { BULK_ADJUSTMENT_OPTIONS } from '@/features/inventory-cards/domain/constants';

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
  const { detail, loading, refetch } = usePokemonCardDetail(isOpen ? (card?.guid ?? null) : null);

  const {
    selectedVariant,
    stockAdjustment,
    setStockAdjustment,
    movementType,
    setMovementType,
    handleVariantSelect,
    handlePriceSubmit,
    handleStockAdjust,
    control,
    handleSubmit,
    formState,
    updatingPrice,
    adjustLoading,
  } = useCardDetailModal({
    detail,
    card,
    tcgType: 'POKEMON',
    onRefetch: refetch,
  });

  const { data: metricsData } = useQuery(PokemonCardWithMetricsDocument, {
    variables: { guid: card?.guid ?? '' },
    skip: !card?.guid || !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  if (!card) return null;

  const imageUri = detail?.imageUri ?? card.imageUri;
  const name = detail?.name ?? card.name;
  const setName = detail?.setName ?? card.setName;
  const setCode = detail?.setCode ?? card.setCode;
  const totalStock = detail?.totalStock ?? card.totalStock;
  const sellPrice = detail?.sellPrice ?? card.sellPrice;

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size="xl">
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
            <div className="w-40 shrink-0">
              <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-default-100">
                {(() => {
                  const highQualityImage = getHighestQualityImage(detail?.moreImages);
                  const displayImage = highQualityImage?.imageUrl || imageUri;

                  return displayImage ? (
                    <img
                      src={displayImage}
                      alt={name}
                      className="absolute inset-0 h-full w-full object-contain p-1"
                    />
                  ) : (
                    <Image
                      src={pokemonCardPlaceholder}
                      alt="Pokemon card placeholder"
                      fill
                      sizes="160px"
                      className="object-contain p-1"
                    />
                  );
                })()}
              </div>
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
                  Pokemon
                </Chip>
                {detail?.variant && (detail.variant.toLowerCase().includes('holo') || detail.variant.toLowerCase().includes('foil')) && (
                  <FoilChip label={detail.variant} variant="subtle" />
                )}
              </div>

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
                {!loading && detail?.type && (
                  <>
                    <span className="text-default-500">Tipo</span>
                    <div className="flex items-center gap-1">
                      <PokemonTypeIcon type={detail.type} size="sm" />
                      <span className="font-medium">{detail.type}</span>
                    </div>
                  </>
                )}
                {!loading && detail?.hp && (
                  <>
                    <span className="text-default-500">HP</span>
                    <span className="font-medium">{detail.hp}</span>
                  </>
                )}
                {!loading && detail?.stage && (
                  <>
                    <span className="text-default-500">Etapa</span>
                    <span className="font-medium">{detail.stage}</span>
                  </>
                )}
                {!loading && detail?.releaseDate && (
                  <>
                    <span className="text-default-500">Lanzamiento</span>
                    <span className="font-medium">{formatReleaseDate(detail.releaseDate)}</span>
                  </>
                )}
                {!loading && detail?.artist && (
                  <>
                    <span className="text-default-500">Artista</span>
                    <span className="font-medium">{detail.artist}</span>
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
            <h4 className="text-sm font-semibold">Variantes por condición</h4>
            {loading ? (
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.values(CARD_CONDITIONS).map((condition) => {
                  const existing = detail?.inventoryCards?.find((v) => v.condition === condition);
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
                      {CARD_CONDITION_SHORT_LABELS[condition]} ({variant.stock})
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {!loading && detail?.cardText && (
            <>
              <Divider />
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold">Texto de la carta</h4>
                <div className="rounded-lg bg-default-50 p-3">
                  <div 
                    className="text-sm text-default-700"
                    dangerouslySetInnerHTML={{ __html: detail.cardText }}
                  />
                </div>
              </div>
            </>
          )}

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

              {metricsData?.pokemonCardWithMetrics && (
                <>
                  <Divider />
                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold">Precios de mercado (MXN)</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-default-500">Precio referencia (Ungraded)</span>
                        <span className="font-bold text-accent">
                          {metricsData.pokemonCardWithMetrics.ungradedPrice
                            ? `$${metricsData.pokemonCardWithMetrics.ungradedPrice.toFixed(2)}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-default-500">Precio PSA 7</span>
                        <span className="font-bold text-blue-600">
                          {metricsData.pokemonCardWithMetrics.gradedPriceSeven
                            ? `$${metricsData.pokemonCardWithMetrics.gradedPriceSeven.toFixed(2)}`
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
                    isLoading={adjustLoading}
                    onPress={handleStockAdjust}
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
    </KidstopDrawer>
  );
}
