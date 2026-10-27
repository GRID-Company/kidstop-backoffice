'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Skeleton,
  Tabs,
  Tab,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { Icon } from '@iconify/react';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import FoilChip from '@/shared/components/foil-chip';
import { CardImage } from '@/shared/components/card-image';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { formatCardNumber } from '@/lib/utils/format-card-number';
import { IMagicCard } from '../../domain/types';
import { CARD_SEARCH_LIMIT } from '../../domain/constants';
import { useMagicCardDetail } from '../hooks/use-magic-card-detail';
import { useCardDetailModal } from '../hooks/use-card-detail-modal';
import {
  MagicCardWithMetricsDocument,
  MagicCardInternalListDocument,
  MagicCardCollectionsDocument,
} from '@/lib/api/generated/catalog-magic.generated';
import { CardLanguage } from '@/lib/api/schema-types';
import InventoryAdjustmentConfirmationModal from '@/features/inventory-cards/ui/components/inventory-adjustment-confirmation-modal';
import { toMagicCard } from '../../adapters/mappers/card.mapper';
import CardSearch from '@/shared/blocks/card-search';
import LanguagePills, { LanguageFilter } from './card-detail/language-pills';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { TCG_THEMES } from '@/lib/consts/tcg-themes';
import {
  isStockAdjustmentDisabled,
  toSetCodeOptions,
} from '../../domain/catalog.domain';
import StockAdjustmentTab from './card-detail-tabs/stock-adjustment-tab';
import PriceEditTab from './card-detail-tabs/price-edit-tab';
import MovementsHistoryTab from './card-detail-tabs/movements-history-tab';
import PriceHistoryTab from './card-detail-tabs/price-history-tab';
import InventoryConditionTable from './card-detail/inventory-condition-table';
import PrintDataSection from './card-detail/print-data-section';
import MarketTab, {
  MarketReferencePrice,
  MarketVariantMetric,
} from './card-detail/market-tab';

type DetailActionView = 'summary' | 'adjust' | 'price';

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
  const [setGuid, setSetGuid] = useState('');
  const [actionView, setActionView] = useState<DetailActionView>('summary');
  const [metricsRequested, setMetricsRequested] = useState(false);
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('ALL');
  const prevIsOpenRef = useRef(isOpen);
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      setSelectedCard(card);
      setItemSearch('');
      setSetGuid('');
      setActionView('summary');
      setMetricsRequested(false);
      setLanguageFilter('ALL');
    }
  }, [isOpen, card]);

  useEffect(() => {
    setMetricsRequested(false);
  }, [selectedCard?.guid]);

  const { detail, loading, refetch } = useMagicCardDetail(
    isOpen ? (selectedCard?.guid ?? null) : null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    selectedVariant,
    selectedLanguage,
    availableVariants,
    allVariants,
    languageOptions,
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
    detail,
    card: selectedCard,
    tcgType: 'MAGIC',
    onRefetch: refetch,
  });

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

  const { data: collectionsData } = useQuery(MagicCardCollectionsDocument, {
    skip: !isOpen,
    fetchPolicy: 'cache-first',
  });

  const setItems = useMemo(
    () => toSetCodeOptions(collectionsData?.magicCardCollections ?? []),
    [collectionsData]
  );

  const { data: searchData, loading: searchLoading } = useQuery(
    MagicCardInternalListDocument,
    {
      variables: {
        findMagicCardsPublicArgs: {
          skip: 0,
          limit: CARD_SEARCH_LIMIT,
          search: itemSearch.trim() || undefined,
          sort: { column: 'releaseDate', order: 'DESC' },
          filters: { edition: setGuid || undefined },
        },
      },
      skip: !!selectedCard || (itemSearch.trim().length < 2 && !setGuid),
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

  const [
    fetchMetrics,
    { data: metricsData, loading: metricsLoading, error: metricsError },
  ] = useLazyQuery(MagicCardWithMetricsDocument, {
    fetchPolicy: 'cache-and-network',
  });

  const handleMetricsRequest = useCallback(() => {
    if (!selectedCard?.guid) return;
    setMetricsRequested(true);
    void fetchMetrics({ variables: { guid: selectedCard.guid } });
  }, [fetchMetrics, selectedCard?.guid]);

  const metrics = metricsData?.magicCardWithMetrics;

  const referencePrices = useMemo<MarketReferencePrice[]>(
    () => [
      { label: 'Retail', value: metrics?.priceRetail ?? null },
      { label: 'Buylist', value: metrics?.priceBuy ?? null },
    ],
    [metrics]
  );

  const variantMetrics = useMemo<MarketVariantMetric[]>(
    () =>
      (metrics?.variantsMetrics ?? [])
        .filter((v): v is NonNullable<typeof v> => v != null)
        .map((v) => ({
          condition: v.condition,
          language: v.language as CardLanguage,
          stock: v.stock,
          wishlistCount: v.wishlistCount,
          avgDaysInInventory: v.avgDaysInInventory,
          lastSellDate: v.lastSellDate as string | number | null,
        })),
    [metrics]
  );

  const imageUri = detail?.imageUri ?? selectedCard?.imageUri;
  const name = detail?.name ?? selectedCard?.name;
  const edition = detail?.edition ?? selectedCard?.edition;
  const collectorNumber =
    detail?.collectorNumber ?? selectedCard?.collectorNumber;
  const rarity = detail?.rarity ?? selectedCard?.rarity;
  const isFoil = detail?.isFoil ?? selectedCard?.isFoil;
  const totalStock = detail?.totalStock ?? selectedCard?.totalStock;

  const handleImagePreview = useCallback(() => {
    openPreview(imageUri ?? null, name ?? '', 'MAGIC');
  }, [openPreview, imageUri, name]);

  return (
    <>
      <KidstopDrawer
        isOpen={isOpen}
        onClose={onClose}
        size='4xl'
        data-testid='magic-card-detail-modal'
      >
        <DrawerContent>
          <DrawerHeader className='flex flex-col gap-1'>
            <span className='text-accent text-[10px] font-semibold tracking-widest uppercase'>
              Magic: The Gathering · Catálogo interno
            </span>
            <span className='text-accent text-lg font-semibold'>
              {selectedCard
                ? `${name}${collectorNumber ? ` ${formatCardNumber(collectorNumber)}` : ''}`
                : 'Ajuste de inventario'}
            </span>
            <div className='flex items-center gap-2'>
              <span className='text-default-500 text-sm font-normal'>
                {selectedCard
                  ? edition
                  : 'Buscar carta por nombre, edición o código'}
              </span>
              {selectedCard && (
                <>
                  {isFoil && <FoilChip label='Foil' variant='subtle' />}
                  {rarity && (
                    <Chip size='sm' variant='flat' color='secondary'>
                      {rarity}
                    </Chip>
                  )}
                </>
              )}
            </div>
          </DrawerHeader>

          <DrawerBody className='flex flex-col gap-5'>
            {!selectedCard && (
              <CardSearch
                searchValue={itemSearch}
                onSearchChange={setItemSearch}
                results={searchResults}
                loading={searchLoading}
                onCardSelect={handleCardSelect}
                placeholder='Buscar carta por nombre, edición o código...'
                setItems={setItems}
                selectedSet={setGuid}
                onSetChange={setSetGuid}
                renderCard={(result) => (
                  <>
                    <div className='bg-default-100 relative h-10 w-8 shrink-0 overflow-hidden rounded'>
                      <CardImage
                        src={result.imageUri}
                        alt={result.name}
                        tcgType='MAGIC'
                        containerClassName='absolute inset-0'
                        className='object-contain'
                        fill
                        sizes='32px'
                      />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>
                        {result.name}
                      </p>
                      <p className='text-default-500 truncate text-xs'>
                        {result.edition} ·{' '}
                        {formatCardNumber(result.collectorNumber)}
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
                <div className='flex flex-col gap-5 sm:flex-row'>
                  <div className='w-full shrink-0 sm:w-44'>
                    <div
                      className='bg-default-100 relative aspect-3/4 w-full cursor-pointer overflow-hidden rounded-xl transition-opacity hover:opacity-80'
                      onClick={handleImagePreview}
                      role='button'
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleImagePreview();
                      }}
                      aria-label={`Ver ${name} en tamaño completo`}
                    >
                      <CardImage
                        src={imageUri}
                        alt={name ?? ''}
                        tcgType='MAGIC'
                        containerClassName='absolute inset-0'
                        className='object-contain p-1'
                        fill
                        sizes='176px'
                      />
                    </div>
                  </div>

                  <div className='border-default-200 flex-1 rounded-xl border bg-white p-4'>
                    <h4 className='text-default-500 mb-3 text-xs font-semibold tracking-wide uppercase'>
                      Datos de la impresión
                    </h4>
                    <div className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm'>
                      {edition && (
                        <>
                          <span className='text-default-500'>Edición</span>
                          <span className='font-medium'>{edition}</span>
                        </>
                      )}
                      {loading ? (
                        <>
                          <span className='text-default-500'>Número</span>
                          <Skeleton className='h-4 w-12 rounded' />
                        </>
                      ) : collectorNumber ? (
                        <>
                          <span className='text-default-500'>Número</span>
                          <span className='font-medium'>
                            {formatCardNumber(collectorNumber)}
                          </span>
                        </>
                      ) : null}
                      <span className='text-default-500'>Idioma</span>
                      <span className='font-medium'>
                        {
                          LANGUAGE_LABELS[
                            (detail?.language ?? selectedCard?.language) ||
                              CardLanguage.English
                          ]
                        }
                      </span>
                      <span className='text-default-500'>Tratamiento</span>
                      <span className='font-medium'>
                        {isFoil ? 'Foil' : 'No Foil'}
                      </span>
                      <span className='text-default-500'>Existencias</span>
                      <span className='font-medium'>{totalStock ?? 0} uds</span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-3'>
                  <h4 className='text-sm font-semibold'>
                    Inventario por condición
                  </h4>
                  <LanguagePills
                    options={languageOptions}
                    totalCount={allVariants.reduce(
                      (acc, v) => acc + v.stock,
                      0
                    )}
                    value={languageFilter}
                    onChange={(value) => {
                      setLanguageFilter(value);
                      if (value !== 'ALL') handleLanguageChange(value);
                    }}
                  />
                  {loading ? (
                    <Skeleton className='h-40 w-full rounded-xl' />
                  ) : (
                    <InventoryConditionTable
                      availableVariants={
                        languageFilter === 'ALL'
                          ? allVariants
                          : availableVariants
                      }
                      selectedVariant={selectedVariant}
                      selectedLanguage={selectedLanguage}
                      showAllLanguages={languageFilter === 'ALL'}
                      onVariantSelect={handleVariantSelect}
                    />
                  )}
                </div>

                {actionView === 'summary' && (
                  <>
                    <Tabs
                      aria-label='Detalle de la carta'
                      fullWidth
                      color='primary'
                      classNames={{
                        tabList: 'w-full',
                      }}
                      style={
                        {
                          '--heroui-primary': TCG_THEMES.MAGIC.accentHsl,
                        } as React.CSSProperties
                      }
                    >
                      <Tab key='resumen' title='Resumen'>
                        <div className='flex flex-col gap-4 pt-3'>
                          <PrintDataSection
                            fields={[
                              { label: 'Rareza', value: rarity ?? null },
                              {
                                label: 'Tratamiento',
                                value: isFoil ? 'Foil' : 'No Foil',
                              },
                              { label: 'Edición', value: edition ?? null },
                            ]}
                          />
                        </div>
                      </Tab>

                      <Tab key='movements' title='Historial de movimientos'>
                        <div className='pt-3'>
                          {selectedVariant?.inventoryItemGuid ? (
                            <MovementsHistoryTab
                              inventoryItemGuid={
                                selectedVariant.inventoryItemGuid
                              }
                              tcgType='MAGIC'
                            />
                          ) : (
                            <p className='text-default-400 p-6 text-center text-sm'>
                              Sin registro de inventario para esta condición.
                            </p>
                          )}
                        </div>
                      </Tab>

                      <Tab key='price-history' title='Historial de precios'>
                        <div className='pt-3'>
                          {selectedVariant?.inventoryItemGuid ? (
                            <PriceHistoryTab
                              inventoryItemGuid={
                                selectedVariant.inventoryItemGuid
                              }
                            />
                          ) : (
                            <p className='text-default-400 p-6 text-center text-sm'>
                              Sin registro de inventario para esta condición.
                            </p>
                          )}
                        </div>
                      </Tab>

                      <Tab key='market' title='Mercado'>
                        <div className='pt-3'>
                          <MarketTab
                            providerName='Card Kingdom'
                            referencePrices={referencePrices}
                            variantMetrics={variantMetrics}
                            loading={metricsLoading}
                            requested={metricsRequested}
                            error={!!metricsError}
                            onRequest={handleMetricsRequest}
                          />
                        </div>
                      </Tab>
                    </Tabs>
                  </>
                )}

                {actionView === 'adjust' && (
                  <div className='flex flex-col gap-3'>
                    <h4 className='text-sm font-semibold'>
                      Ajustar inventario
                    </h4>
                    <StockAdjustmentTab control={stockControl} />
                  </div>
                )}

                {actionView === 'price' && (
                  <div className='flex flex-col gap-3'>
                    <h4 className='text-sm font-semibold'>
                      Editar precio de venta
                    </h4>
                    <form
                      onSubmit={(...args) => {
                        void handleSubmit(handlePriceSubmit)(...args);
                      }}
                    >
                      <PriceEditTab control={control} formState={formState} />
                    </form>
                  </div>
                )}
              </>
            )}
          </DrawerBody>

          <DrawerFooter className='flex justify-end gap-3'>
            {actionView === 'summary' && (
              <>
                <Button
                  variant='light'
                  onPress={onClose}
                  className='text-accent'
                  data-testid='close-modal-button'
                >
                  Cerrar
                </Button>
                {selectedCard && (
                  <>
                    <Button
                      variant='bordered'
                      onPress={() => setActionView('price')}
                      startContent={<Icon icon='lucide:pencil' />}
                      className='text-accent border-accent/40'
                      data-testid='open-price-edit-button'
                    >
                      Editar precios
                    </Button>
                    <KidstopButton
                      variant='accent'
                      onPress={() => setActionView('adjust')}
                      startContent={<Icon icon='lucide:package-plus' />}
                      data-testid='open-stock-adjust-button'
                    >
                      Ajustar inventario
                    </KidstopButton>
                  </>
                )}
              </>
            )}

            {actionView === 'adjust' && (
              <>
                <Button
                  variant='light'
                  onPress={() => setActionView('summary')}
                  className='text-accent'
                  data-testid='back-to-summary-button'
                >
                  Volver al resumen
                </Button>
                <KidstopButton
                  variant='accent'
                  onPress={handleStockAdjustClick}
                  isLoading={adjustLoading}
                  isDisabled={
                    !stockFormState.isValid || !stockFormState.isDirty
                  }
                  startContent={<Icon icon='lucide:package-plus' />}
                  data-testid='save-stock-adjustment-button'
                >
                  Aplicar ajuste
                </KidstopButton>
              </>
            )}

            {actionView === 'price' && (
              <>
                <Button
                  variant='light'
                  onPress={() => setActionView('summary')}
                  className='text-accent'
                  data-testid='back-to-summary-button'
                >
                  Volver al resumen
                </Button>
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
              </>
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
      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />
    </>
  );
}
