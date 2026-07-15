'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  Tabs,
  Tab,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { Icon } from '@iconify/react';
import { useQuery } from '@apollo/client/react';
import FoilChip from '@/shared/components/foil-chip';
import { IMagicCard, CardCondition } from '../../domain/types';
import {
  CARD_CONDITION_LABELS,
  CARD_CONDITION_SHORT_LABELS,
  CARD_CONDITIONS,
  CARD_SEARCH_LIMIT,
} from '../../domain/constants';
import { useMagicCardDetail } from '../hooks/use-magic-card-detail';
import {
  useCardDetailModal,
  InventoryCard,
} from '../hooks/use-card-detail-modal';
import {
  MagicCardWithMetricsDocument,
  MagicCardInternalListDocument,
} from '@/lib/api/generated/catalog-magic.generated';
import { CardLanguage } from '@/lib/api/schema-types';
import InventoryAdjustmentConfirmationModal from '@/features/inventory-cards/ui/components/inventory-adjustment-confirmation-modal';
import { toMagicCard } from '../../adapters/mappers/card.mapper';
import CardSearch from '@/shared/blocks/card-search';
import { LanguageSelector } from '@/shared/components/language-selector';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { isStockAdjustmentDisabled } from '../../domain/catalog.domain';
import StockAdjustmentTab from './card-detail-tabs/stock-adjustment-tab';
import PriceEditTab from './card-detail-tabs/price-edit-tab';
import MovementsHistoryTab from './card-detail-tabs/movements-history-tab';
import PriceHistoryTab from './card-detail-tabs/price-history-tab';
import VariantInfoTab from './card-detail-tabs/variant-info-tab';

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
  const prevIsOpenRef = useRef(isOpen);

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      setSelectedCard(card);
      setItemSearch('');
    }
  }, [isOpen, card]);

  const {
    detail,
    loading: _detailLoading,
    refetch,
  } = useMagicCardDetail(isOpen ? (selectedCard?.guid ?? null) : null);
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
    updatingPrice,
    adjustLoading,
    cardName,
  } = useCardDetailModal({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detail: detail as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    card: selectedCard as any,
    tcgType: 'MAGIC',
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
    MagicCardInternalListDocument,
    {
      variables: {
        findMagicCardsPublicArgs: {
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

  const searchResults = useMemo<IMagicCard[]>(() => {
    const raw = searchData?.magicCardInternalList?.data;
    if (!raw) return [];
    return raw
      .filter((card): card is NonNullable<typeof card> => card != null)
      .map(toMagicCard);
  }, [searchData]);

  const handleCardSelect = useCallback((card: IMagicCard) => {
    setSelectedCard(card);
  }, []);

  const { data: metricsData } = useQuery(MagicCardWithMetricsDocument, {
    variables: { guid: selectedCard?.guid ?? '' },
    skip: !selectedCard?.guid || !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  const imageUri = detail?.imageUri ?? selectedCard?.imageUri;
  const name = detail?.name ?? selectedCard?.name;
  const edition = detail?.edition ?? selectedCard?.edition;
  const collectorNumber =
    detail?.collectorNumber ?? selectedCard?.collectorNumber;
  const rarity = detail?.rarity ?? selectedCard?.rarity;
  const isFoil = detail?.isFoil ?? selectedCard?.isFoil;
  const totalStock = detail?.totalStock ?? selectedCard?.totalStock;
  const _variants = detail?.inventoryCards ?? selectedCard?.variants ?? [];

  const variantMetrics =
    metricsData?.magicCardWithMetrics?.variantsMetrics?.find(
      (v) =>
        v?.condition === selectedVariant?.condition &&
        v?.language === selectedVariant?.language
    );

  const totalWishlistCount = useMemo(() => {
    if (!metricsData?.magicCardWithMetrics?.variantsMetrics) return 0;
    return metricsData.magicCardWithMetrics.variantsMetrics.reduce(
      (sum, variant) => sum + (variant?.wishlistCount ?? 0),
      0
    );
  }, [metricsData]);

  return (
    <>
      <KidstopDrawer
        isOpen={isOpen}
        onClose={onClose}
        size='4xl'
        data-testid='magic-card-detail-modal'
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
                    {edition && <span>{edition}</span>}
                    {collectorNumber && (
                      <>
                        <span>·</span>
                        <span>#{collectorNumber}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span>Buscar carta por nombre, edición o código</span>
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
                placeholder='Buscar carta por nombre, edición o código...'
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
                          src={magicCardPlaceholder}
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
                        {result.edition} · #{result.collectorNumber}
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
                <div className='flex gap-6'>
                  <div className='bg-default-100 relative aspect-3/4 w-40 shrink-0 overflow-hidden rounded-lg'>
                    {imageUri ? (
                      <img
                        src={imageUri}
                        alt={name}
                        className='absolute inset-0 h-full w-full object-contain p-1'
                      />
                    ) : (
                      <Image
                        src={magicCardPlaceholder}
                        alt='Magic card placeholder'
                        fill
                        sizes='160px'
                        className='object-contain p-1'
                      />
                    )}
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
                        Magic
                      </Chip>
                      {rarity && (
                        <Chip size='sm' variant='flat'>
                          {rarity}
                        </Chip>
                      )}
                      {isFoil && <FoilChip label='Foil' variant='subtle' />}
                    </div>

                    <div className='mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm'>
                      {edition && (
                        <>
                          <span className='text-default-500'>Edición</span>
                          <span className='font-medium'>{edition}</span>
                        </>
                      )}

                      {collectorNumber && (
                        <>
                          <span className='text-default-500'>Número</span>
                          <span className='font-medium'>
                            #{collectorNumber}
                          </span>
                        </>
                      )}

                      {(detail?.language || selectedCard?.language) && (
                        <>
                          <span className='text-default-500'>Idioma</span>
                          <span className='font-medium'>
                            {
                              LANGUAGE_LABELS[
                                (detail?.language ?? selectedCard?.language) ||
                                  CardLanguage.English
                              ]
                            }
                          </span>
                        </>
                      )}

                      <span className='text-default-500'>Stock total</span>
                      <span className='font-medium'>{totalStock}</span>
                    </div>
                  </div>
                </div>

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
                          className={isSelected ? 'border-none text-white' : ''}
                          style={
                            isSelected
                              ? { backgroundColor: 'var(--color-accent)' }
                              : undefined
                          }
                          onPress={() => handleVariantSelect(variant)}
                          data-testid={`variant-button-${condition.toLowerCase().replace(/_/g, '-')}`}
                        >
                          {
                            CARD_CONDITION_SHORT_LABELS[
                              condition as keyof typeof CARD_CONDITION_SHORT_LABELS
                            ]
                          }{' '}
                          ({variant.stock})
                        </Button>
                      );
                    })}
                  </div>
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
                            metricsData?.magicCardWithMetrics
                              ? {
                                  priceRetail:
                                    metricsData.magicCardWithMetrics
                                      .priceRetail,
                                  priceBuy:
                                    metricsData.magicCardWithMetrics.priceBuy,
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
                              tcgType='MAGIC'
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
                isDisabled={!stockFormState.isValid || !stockFormState.isDirty}
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
