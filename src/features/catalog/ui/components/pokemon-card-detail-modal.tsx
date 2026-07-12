'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  Tabs,
  Tab,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { Icon } from '@iconify/react';
import FoilChip from '@/shared/components/foil-chip';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import { formatReleaseDate } from '@/lib/utils/format-date';
import { getHighestQualityImage } from '@/lib/utils/image-utils';
import { IPokemonCard, CardCondition } from '../../domain/types';
import {
  CARD_CONDITION_LABELS,
  CARD_CONDITION_SHORT_LABELS,
  CARD_SEARCH_LIMIT,
} from '../../domain/constants';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { usePokemonCardDetail } from '../hooks/use-pokemon-card-detail';
import {
  useCardDetailModal,
  InventoryCard,
} from '../hooks/use-card-detail-modal';
import { useQuery } from '@apollo/client/react';
import {
  PokemonCardWithMetricsDocument,
  PokemonCardInternalListDocument,
} from '@/lib/api/generated/catalog-pokemon.generated';
import { CardLanguage } from '@/lib/api/schema-types';
import InventoryAdjustmentConfirmationModal from '@/features/inventory-cards/ui/components/inventory-adjustment-confirmation-modal';
import { toPokemonCard } from '../../adapters/mappers/card.mapper';
import CardSearch from '@/shared/blocks/card-search';
import { LanguageSelector } from '@/shared/components/language-selector';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { isStockAdjustmentDisabled } from '../../domain/catalog.domain';
import StockAdjustmentTab from './card-detail-tabs/stock-adjustment-tab';
import PriceEditTab from './card-detail-tabs/price-edit-tab';
import MovementsHistoryTab from './card-detail-tabs/movements-history-tab';
import PriceHistoryTab from './card-detail-tabs/price-history-tab';
import VariantInfoTab from './card-detail-tabs/variant-info-tab';

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
  const [selectedCard, setSelectedCard] = useState<IPokemonCard | null>(card);
  const [itemSearch, setItemSearch] = useState('');
  const prevIsOpenRef = useRef(isOpen);

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      setSelectedCard(card);
      setItemSearch('');
    }
  }, [isOpen, card]);

  const { detail, loading, refetch } = usePokemonCardDetail(
    isOpen ? (selectedCard?.guid ?? null) : null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    selectedVariant,
    selectedLanguage,
    availableVariants,
    handleLanguageChange,
    stockControl,
    stockFormState,
    stockWatch,
    handleVariantSelect,
    handlePriceSubmit,
    executeStockAdjust,
    control,
    handleSubmit,
    formState,
    watch,
    updatingPrice,
    adjustLoading,
    cardName,
  } = useCardDetailModal({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detail: detail as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    card: selectedCard as any,
    tcgType: 'POKEMON',
    onRefetch: refetch,
  });

  const [selectedTab, setSelectedTab] = useState('info');

  const handleStockAdjustClick = useCallback(() => {
    const formValues = stockWatch();
    if (isStockAdjustmentDisabled(formValues.quantity, formValues.movementType))
      return;
    setIsConfirmModalOpen(true);
  }, [stockWatch]);

  const handleConfirmAdjustment = useCallback(async () => {
    await executeStockAdjust();
    setIsConfirmModalOpen(false);
  }, [executeStockAdjust]);

  const { data: searchData, loading: searchLoading } = useQuery(
    PokemonCardInternalListDocument,
    {
      variables: {
        findPokemonCardsPublicArgs: {
          skip: 0,
          limit: CARD_SEARCH_LIMIT,
          search: itemSearch.trim() || undefined,
          sort: { column: 'releaseDate', order: 'DESC' },
          filters: {},
        },
      },
      skip: !!selectedCard || itemSearch.trim().length < 2,
      fetchPolicy: 'network-only',
    }
  );

  const searchResults = useMemo<IPokemonCard[]>(() => {
    const raw = searchData?.pokemonCardInternalList?.data;
    if (!raw) return [];
    return raw
      .filter((card): card is NonNullable<typeof card> => card != null)
      .map(toPokemonCard);
  }, [searchData]);

  const handleCardSelect = useCallback((card: IPokemonCard) => {
    setSelectedCard(card);
  }, []);

  const { data: metricsData } = useQuery(PokemonCardWithMetricsDocument, {
    variables: { guid: selectedCard?.guid ?? '' },
    skip: !selectedCard?.guid || !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  const variantMetrics =
    metricsData?.pokemonCardWithMetrics?.variantsMetrics?.find(
      (v) =>
        v?.condition === selectedVariant?.condition &&
        v?.language === selectedVariant?.language
    );

  const totalWishlistCount = useMemo(() => {
    if (!metricsData?.pokemonCardWithMetrics?.variantsMetrics) return 0;
    return metricsData.pokemonCardWithMetrics.variantsMetrics.reduce(
      (sum, variant) => sum + (variant?.wishlistCount ?? 0),
      0
    );
  }, [metricsData]);

  const imageUri = detail?.imageUri ?? selectedCard?.imageUri;
  const name = detail?.name ?? selectedCard?.name;
  const setName = detail?.setName ?? selectedCard?.setName;
  const setCode = detail?.setCode ?? selectedCard?.setCode;
  const totalStock = detail?.totalStock ?? selectedCard?.totalStock;
  const sellPrice = detail?.sellPrice ?? selectedCard?.sellPrice;

  return (
    <>
      <KidstopDrawer
        isOpen={isOpen}
        onClose={onClose}
        size='4xl'
        data-testid='pokemon-card-detail-modal'
      >
        <DrawerContent>
          <DrawerHeader className='flex flex-col gap-2'>
            <span className='text-accent text-lg font-semibold'>
              {selectedCard ? name : 'Ajuste de inventario'}
            </span>
            <div className='flex items-center gap-2'>
              <span className='text-default-500 text-sm font-normal'>
                {selectedCard ? (
                  <>
                    {[setName, setCode].filter(Boolean).join(' · ')}
                    {detail?.cardNumber ? ` · ${detail.cardNumber}` : ''}
                  </>
                ) : (
                  'Buscar carta por nombre, set o código'
                )}
              </span>
              {selectedCard && selectedVariant && (
                <>
                  <Chip size='sm' variant='flat' color='primary'>
                    {LANGUAGE_LABELS[selectedLanguage]}
                  </Chip>
                  <Chip size='sm' variant='flat' color='secondary'>
                    {
                      CARD_CONDITION_LABELS[
                        selectedVariant.condition as CardCondition
                      ]
                    }
                  </Chip>
                </>
              )}
            </div>
          </DrawerHeader>

          <DrawerBody className='flex flex-col gap-6'>
            {!selectedCard && (
              <CardSearch
                searchValue={itemSearch}
                onSearchChange={setItemSearch}
                results={searchResults}
                loading={searchLoading}
                onCardSelect={handleCardSelect}
                placeholder='Buscar carta por nombre, set o código...'
                renderCard={(result) => (
                  <>
                    <div className='bg-default-100 relative h-10 w-8 shrink-0 overflow-hidden rounded'>
                      {result.imageUri ? (
                        <img
                          src={result.imageUri}
                          alt={result.name}
                          className='absolute inset-0 h-full w-full object-contain'
                        />
                      ) : (
                        <Image
                          src={pokemonCardPlaceholder}
                          alt='Card placeholder'
                          fill
                          sizes='32px'
                          className='object-contain'
                        />
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>
                        {result.name}
                      </p>
                      <p className='text-default-500 truncate text-xs'>
                        {result.setName} · #{result.cardNumber}
                      </p>
                    </div>
                    <Chip
                      size='sm'
                      variant='flat'
                      color={result.totalStock > 0 ? 'success' : 'default'}
                    >
                      {result.totalStock}
                    </Chip>
                  </>
                )}
              />
            )}

            {selectedCard && (
              <>
                <div className='flex flex-col gap-6 sm:flex-row'>
                  <div className='w-full shrink-0 sm:w-40'>
                    <div className='bg-default-100 relative aspect-3/4 w-full overflow-hidden rounded-lg'>
                      {(() => {
                        const highQualityImage = getHighestQualityImage(
                          detail?.moreImages
                        );
                        const displayImage =
                          highQualityImage?.imageUrl || imageUri;

                        return displayImage ? (
                          <img
                            src={displayImage}
                            alt={name}
                            className='absolute inset-0 h-full w-full object-contain p-1'
                          />
                        ) : (
                          <Image
                            src={pokemonCardPlaceholder}
                            alt='Pokemon card placeholder'
                            fill
                            sizes='160px'
                            className='object-contain p-1'
                          />
                        );
                      })()}
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <Chip
                        size='sm'
                        variant='flat'
                        classNames={{
                          base: 'bg-accent/10',
                          content: 'text-accent font-medium',
                        }}
                      >
                        Pokemon
                      </Chip>
                      {detail?.variant &&
                        (detail.variant.toLowerCase().includes('holo') ||
                          detail.variant.toLowerCase().includes('foil')) && (
                          <FoilChip label={detail.variant} variant='subtle' />
                        )}
                    </div>

                    <div className='mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm'>
                      {setName && (
                        <>
                          <span className='text-default-500'>Set</span>
                          <span className='font-medium'>{setName}</span>
                        </>
                      )}
                      {setCode && (
                        <>
                          <span className='text-default-500'>Código</span>
                          <span className='font-medium'>{setCode}</span>
                        </>
                      )}
                      {loading ? (
                        <>
                          <span className='text-default-500'>Número</span>
                          <Skeleton className='h-4 w-12 rounded' />
                        </>
                      ) : detail?.cardNumber ? (
                        <>
                          <span className='text-default-500'>Número</span>
                          <span className='font-medium'>
                            {detail.cardNumber}
                          </span>
                        </>
                      ) : null}
                      {loading ? (
                        <>
                          <span className='text-default-500'>Rareza</span>
                          <Skeleton className='h-4 w-20 rounded' />
                        </>
                      ) : detail?.rarity ? (
                        <>
                          <span className='text-default-500'>Rareza</span>
                          <span className='font-medium'>{detail.rarity}</span>
                        </>
                      ) : null}
                      {!loading &&
                        (detail?.language || selectedCard?.language) && (
                          <>
                            <span className='text-default-500'>Idioma</span>
                            <span className='font-medium'>
                              {
                                LANGUAGE_LABELS[
                                  (detail?.language ??
                                    selectedCard?.language) ||
                                    CardLanguage.English
                                ]
                              }
                            </span>
                          </>
                        )}
                      {!loading && detail?.variant && (
                        <>
                          <span className='text-default-500'>Variante</span>
                          <span className='font-medium'>{detail.variant}</span>
                        </>
                      )}
                      {!loading && detail?.type && (
                        <>
                          <span className='text-default-500'>Tipo</span>
                          <div className='flex items-center gap-1'>
                            <PokemonTypeIcon type={detail.type} size='sm' />
                            <span className='font-medium'>{detail.type}</span>
                          </div>
                        </>
                      )}
                      {!loading && detail?.hp && (
                        <>
                          <span className='text-default-500'>HP</span>
                          <span className='font-medium'>{detail.hp}</span>
                        </>
                      )}
                      {!loading && detail?.stage && (
                        <>
                          <span className='text-default-500'>Etapa</span>
                          <span className='font-medium'>{detail.stage}</span>
                        </>
                      )}
                      {!loading && detail?.releaseDate && (
                        <>
                          <span className='text-default-500'>Lanzamiento</span>
                          <span className='font-medium'>
                            {formatReleaseDate(detail.releaseDate)}
                          </span>
                        </>
                      )}
                      {!loading && detail?.artist && (
                        <>
                          <span className='text-default-500'>Artista</span>
                          <span className='font-medium'>{detail.artist}</span>
                        </>
                      )}
                      <span className='text-default-500'>Stock total</span>
                      <span className='font-medium'>{totalStock}</span>
                      {sellPrice !== null && (
                        <>
                          <span className='text-default-500'>Precio venta</span>
                          <span className='text-success font-medium'>
                            ${sellPrice?.toFixed(2)}
                          </span>
                        </>
                      )}
                      <span className='text-default-500'>Disponible</span>
                      <Chip
                        size='sm'
                        variant='flat'
                        color={
                          selectedCard?.availableStock ? 'success' : 'default'
                        }
                      >
                        {selectedCard?.availableStock ? 'Sí' : 'No'}
                      </Chip>
                    </div>
                  </div>
                </div>

                {!loading && detail?.cardText && (
                  <>
                    <Divider />
                    <div className='flex flex-col gap-2'>
                      <h4 className='text-sm font-semibold'>
                        Texto de la carta
                      </h4>
                      <div className='bg-default-50 rounded-lg p-3'>
                        <div
                          className='text-default-700 text-sm'
                          dangerouslySetInnerHTML={{ __html: detail.cardText }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Divider />

                <div className='flex flex-col gap-3'>
                  <h4 className='text-sm font-semibold'>Idioma y condición</h4>
                  <LanguageSelector
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    currentLanguage={
                      detail?.language ?? selectedCard?.language ?? undefined
                    }
                    size='sm'
                  />
                </div>

                <div className='flex flex-col gap-3'>
                  <h4 className='text-sm font-semibold'>
                    Variantes por condición
                  </h4>
                  {loading ? (
                    <div className='flex gap-2'>
                      <Skeleton className='h-8 w-20 rounded-lg' />
                      <Skeleton className='h-8 w-20 rounded-lg' />
                    </div>
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {Object.values(CARD_CONDITIONS).map((condition) => {
                        const existing = availableVariants.find(
                          (v: InventoryCard) => v.condition === condition
                        );
                        const variant: InventoryCard = existing ?? {
                          cardGuid: selectedCard?.guid ?? '',
                          inventoryItemGuid: undefined,
                          isNew: true,
                          condition,
                          language: selectedLanguage,
                          stock: 0,
                          purchasePrice: null,
                          sellPrice: null,
                        };
                        const isSelected =
                          selectedVariant?.condition === condition;
                        return (
                          <Button
                            key={condition}
                            size='sm'
                            variant={isSelected ? 'solid' : 'bordered'}
                            color='default'
                            className={
                              isSelected ? 'border-none text-white' : ''
                            }
                            style={
                              isSelected
                                ? { backgroundColor: 'var(--color-accent)' }
                                : undefined
                            }
                            onPress={() => handleVariantSelect(variant)}
                            data-testid={`variant-button-${condition.toLowerCase().replace(/_/g, '-')}`}
                          >
                            {CARD_CONDITION_SHORT_LABELS[condition]} (
                            {variant.stock})
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {selectedVariant && (
                  <>
                    <Divider />

                    <Tabs
                      aria-label='Opciones de gestión de carta'
                      fullWidth
                      color='default'
                      selectedKey={selectedTab}
                      onSelectionChange={(key) => setSelectedTab(key as string)}
                      classNames={{
                        tabList: 'w-full',
                        tab: 'text-accent',
                        cursor: 'bg-accent',
                        tabContent: 'group-data-[selected=true]:text-white',
                      }}
                    >
                      <Tab key='info' title='Información'>
                        <VariantInfoTab
                          stock={selectedVariant.stock}
                          purchasePrice={selectedVariant.purchasePrice}
                          sellPrice={selectedVariant.sellPrice}
                          marketPrices={
                            metricsData?.pokemonCardWithMetrics
                              ? {
                                  ungradedPrice:
                                    metricsData.pokemonCardWithMetrics
                                      .ungradedPrice,
                                  gradedPriceSeven:
                                    metricsData.pokemonCardWithMetrics
                                      .gradedPriceSeven,
                                }
                              : undefined
                          }
                          wishlistMetrics={{
                            total: totalWishlistCount,
                            variant: variantMetrics?.wishlistCount ?? 0,
                          }}
                          additionalMetrics={
                            variantMetrics
                              ? {
                                  lastSellDate: variantMetrics.lastSellDate
                                    ? new Date(
                                        variantMetrics.lastSellDate as
                                          | string
                                          | number
                                      ).getTime()
                                    : null,
                                  avgDaysInInventory:
                                    variantMetrics.avgDaysInInventory,
                                }
                              : undefined
                          }
                        />
                      </Tab>

                      <Tab key='stock' title='Ajustar stock'>
                        <StockAdjustmentTab control={stockControl} />
                      </Tab>

                      <Tab key='price' title='Editar precio de venta'>
                        <form
                          onSubmit={(...args) => {
                            void handleSubmit(handlePriceSubmit)(...args);
                          }}
                        >
                          <PriceEditTab
                            control={control}
                            formState={formState}
                            watch={watch}
                          />
                        </form>
                      </Tab>

                      {selectedVariant.inventoryItemGuid && (
                        <>
                          <Tab key='movements' title='Movimientos'>
                            <MovementsHistoryTab
                              inventoryItemGuid={
                                selectedVariant.inventoryItemGuid
                              }
                              tcgType='POKEMON'
                            />
                          </Tab>

                          <Tab key='price-history' title='Historial de precios'>
                            <PriceHistoryTab
                              inventoryItemGuid={
                                selectedVariant.inventoryItemGuid
                              }
                            />
                          </Tab>
                        </>
                      )}
                    </Tabs>
                  </>
                )}
              </>
            )}
          </DrawerBody>

          <DrawerFooter className='flex justify-end gap-4'>
            <Button
              variant='light'
              onPress={onClose}
              className='text-accent'
              data-testid='close-modal-button'
            >
              Cerrar
            </Button>

            {selectedTab === 'stock' && (
              <KidstopButton
                variant='accent'
                onPress={handleStockAdjustClick}
                isLoading={adjustLoading}
                isDisabled={!stockFormState.isValid}
                startContent={<Icon icon='lucide:package-plus' />}
                data-testid='save-stock-adjustment-button'
              >
                Aplicar ajuste
              </KidstopButton>
            )}

            {selectedTab === 'price' && (
              <KidstopButton
                variant='accent'
                onPress={() => void handleSubmit(handlePriceSubmit)()}
                isLoading={updatingPrice}
                isDisabled={!formState.isValid}
                startContent={<Icon icon='lucide:save' />}
                data-testid='save-price-button'
              >
                Guardar precios
              </KidstopButton>
            )}
          </DrawerFooter>
        </DrawerContent>
      </KidstopDrawer>

      {selectedVariant && (
        <InventoryAdjustmentConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmAdjustment}
          loading={adjustLoading}
          cardName={cardName ?? name ?? ''}
          condition={selectedVariant.condition}
          language={selectedVariant.language}
          operationType={stockWatch('movementType')}
          quantity={stockWatch('quantity')}
          currentStock={selectedVariant.stock}
        />
      )}
    </>
  );
}
