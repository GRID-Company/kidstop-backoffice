'use client';

import { useState, useMemo, useCallback, forwardRef } from 'react';
import { Accordion, AccordionItem, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import CardImagePreviewModal from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import BulkCardRelatedSelector from './bulk-card-related-selector';
import BulkCardFormControls from './bulk-card-form-controls';
import PriceMetricsSkeleton from './components/price-metrics-skeleton';
import { useCardMetrics } from './hooks/use-card-metrics';
import { BulkCardResultCardProps } from './types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { isValidPrice, isValidQuantity } from '@/lib/utils/validation.utils';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';

function _MetricItem({
  icon,
  label,
  value,
  valueClassName = '',
}: {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className='flex flex-col gap-0.5'>
      <div className='flex items-center gap-1'>
        <Icon icon={icon} width={12} className='text-default-400' />
        <span className='text-default-400 text-[10px]'>{label}</span>
      </div>
      <span className={`text-xs ${valueClassName}`}>{value}</span>
    </div>
  );
}

const BulkCardResultCard = forwardRef<HTMLDivElement, BulkCardResultCardProps>(
  function BulkCardResultCard(
    { result, index, variant, tcgType, onRemove },
    ref
  ) {
    const { setValue, control } = useFormContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const {
      isOpen: isPreviewOpen,
      imageUrl: previewImageUrl,
      alt: previewAlt,
      tcgType: previewTcgType,
      openPreview,
      closePreview,
    } = useCardImagePreview();

    const selectedCardGuid = useWatch({
      control,
      name: `cards.${index}.selectedCardGuid`,
    });

    const quantity = useWatch({
      control,
      name: `cards.${index}.quantity`,
    });

    const condition = useWatch({
      control,
      name: `cards.${index}.condition`,
    });

    const price = useWatch({
      control,
      name:
        variant === 'purchases'
          ? `cards.${index}.offerPrice`
          : `cards.${index}.publicPrice`,
    });

    const selectedCard = useMemo(() => {
      if (selectedCardGuid === result.bestMatch?.guid) {
        return result.bestMatch;
      }
      return (
        result.relatedCards.find((c) => c.guid === selectedCardGuid) ||
        result.bestMatch
      );
    }, [selectedCardGuid, result.bestMatch, result.relatedCards]);

    // Detectar si es related card y necesita métricas
    const isRelatedCard = selectedCardGuid !== result.bestMatch?.guid;
    const needsMetrics =
      tcgType === 'POKEMON' &&
      isRelatedCard &&
      !selectedCard?.cardMetrics?.ungradedPrice;

    // Cargar métricas solo si es necesario
    const { metrics: loadedMetrics, loading: loadingMetrics } = useCardMetrics(
      needsMetrics ? selectedCardGuid : null
    );

    // Combinar selectedCard con métricas cargadas
    const selectedCardWithMetrics = useMemo(() => {
      if (!selectedCard) return null;
      if (!needsMetrics || !loadedMetrics) return selectedCard;

      return {
        ...selectedCard,
        cardMetrics: loadedMetrics,
      };
    }, [selectedCard, needsMetrics, loadedMetrics]);

    const availableRelatedCards = useMemo(() => {
      if (!result.bestMatch) return result.relatedCards;

      if (selectedCardGuid === result.bestMatch.guid) {
        return result.relatedCards;
      }

      const otherRelated = result.relatedCards.filter(
        (c) => c.guid !== selectedCardGuid
      );
      return [result.bestMatch, ...otherRelated];
    }, [selectedCardGuid, result.bestMatch, result.relatedCards]);

    const isConfigured = useMemo(() => {
      const hasValidGuid = !!selectedCardGuid;
      const hasValidCondition = !!condition;
      const hasValidQuantity = isValidQuantity(quantity);
      const hasValidPrice = isValidPrice(price);

      return (
        hasValidGuid && hasValidCondition && hasValidQuantity && hasValidPrice
      );
    }, [selectedCardGuid, condition, quantity, price]);

    const handleSelectRelatedCard = useCallback(
      (cardGuid: string) => {
        setValue(`cards.${index}.selectedCardGuid`, cardGuid);
      },
      [setValue, index]
    );

    if (result.error) {
      return (
        <KidstopCard ref={ref} className='border-danger w-full'>
          <CardBody className='flex flex-row items-center gap-3 !p-3'>
            <Icon
              icon='lucide:alert-circle'
              width={24}
              className='text-danger'
            />
            <div className='flex-1'>
              <p className='text-danger text-sm font-semibold'>
                Error al procesar
              </p>
              <p className='text-default-500 text-xs'>{result.originalLine}</p>
              <p className='text-danger text-xs'>{result.error}</p>
            </div>
            {onRemove && (
              <button
                type='button'
                onClick={onRemove}
                className='text-danger hover:bg-danger-50 rounded-md p-1 transition-colors'
                aria-label='Eliminar carta'
              >
                <Icon icon='lucide:x' width={20} />
              </button>
            )}
          </CardBody>
        </KidstopCard>
      );
    }

    if (!selectedCardWithMetrics) {
      return (
        <KidstopCard ref={ref} className='border-warning w-full'>
          <CardBody className='flex flex-row items-center gap-3 !p-3'>
            <Icon icon='lucide:search-x' width={24} className='text-warning' />
            <div className='flex-1'>
              <p className='text-warning text-sm font-semibold'>
                No se encontró coincidencia
              </p>
              <p className='text-default-500 text-xs'>{result.originalLine}</p>
            </div>
            {onRemove && (
              <button
                type='button'
                onClick={onRemove}
                className='text-warning hover:bg-warning-50 rounded-md p-1 transition-colors'
                aria-label='Eliminar carta'
              >
                <Icon icon='lucide:x' width={20} />
              </button>
            )}
          </CardBody>
        </KidstopCard>
      );
    }

    const displayCard = selectedCardWithMetrics;

    return (
      <KidstopCard
        ref={ref}
        className={`w-full border-l-4 ${isConfigured ? 'border-l-success' : 'border-l-warning'}`}
      >
        <Accordion
          variant='light'
          selectedKeys={isExpanded ? ['content'] : []}
          onSelectionChange={(keys) => {
            setIsExpanded(Array.from(keys).includes('content'));
          }}
        >
          <AccordionItem
            key='content'
            aria-label={displayCard.name}
            title={
              <div className='flex items-center gap-3 py-1'>
                <div
                  className='bg-default-100 relative h-[90px] w-[65px] shrink-0 cursor-pointer overflow-hidden rounded-md transition-opacity hover:opacity-80'
                  onClick={(e) => {
                    e.stopPropagation();
                    openPreview(
                      displayCard.imageUri ?? null,
                      displayCard.name,
                      tcgType as 'POKEMON' | 'MAGIC'
                    );
                  }}
                  role='button'
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation();
                      openPreview(
                        displayCard.imageUri ?? null,
                        displayCard.name,
                        tcgType as 'POKEMON' | 'MAGIC'
                      );
                    }
                  }}
                  aria-label={`Ver ${displayCard.name} en tamaño completo`}
                >
                  {displayCard.imageUri ? (
                    <img
                      src={displayCard.imageUri}
                      alt={displayCard.name}
                      className='absolute inset-0 h-full w-full object-contain p-1'
                    />
                  ) : (
                    <Image
                      src={
                        tcgType === 'MAGIC'
                          ? magicCardPlaceholder
                          : pokemonCardPlaceholder
                      }
                      alt={`${tcgType} card placeholder`}
                      fill
                      sizes='65px'
                      className='object-contain p-1'
                    />
                  )}
                </div>
                <div className='flex flex-1 flex-col gap-1'>
                  <p className='text-sm leading-tight font-semibold'>
                    {displayCard.name}
                  </p>
                  <div className='flex flex-wrap items-center gap-1.5'>
                    {tcgType === 'POKEMON' && displayCard.type && (
                      <PokemonTypeIcon type={displayCard.type} size='sm' />
                    )}
                    {tcgType === 'POKEMON' && displayCard.hp && (
                      <Chip
                        size='sm'
                        variant='flat'
                        className='h-4 px-1 text-[9px]'
                      >
                        {displayCard.hp} HP
                      </Chip>
                    )}
                    {displayCard.variant &&
                      !displayCard.variant.toLowerCase().includes('normal') && (
                        <Chip
                          size='sm'
                          variant='flat'
                          color='secondary'
                          className='h-4 px-1 text-[9px]'
                        >
                          {displayCard.variant}
                        </Chip>
                      )}
                  </div>
                  <p className='text-default-500 text-xs'>
                    {displayCard.edition} · #{displayCard.collectorNumber}
                  </p>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-1'>
                      <Icon
                        icon='lucide:package'
                        width={12}
                        className={
                          displayCard.totalStock > 0
                            ? 'text-success'
                            : 'text-danger'
                        }
                      />
                      <span className='text-default-500 text-xs'>
                        {displayCard.totalStock > 0
                          ? `${displayCard.totalStock} en stock`
                          : 'Sin stock'}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Icon
                        icon='lucide:tag'
                        width={12}
                        className='text-default-400'
                      />
                      <span
                        className={`text-xs ${displayCard.sellPrice && displayCard.sellPrice > 0 ? 'text-accent font-semibold' : 'text-default-400'}`}
                      >
                        {displayCard.sellPrice && displayCard.sellPrice > 0
                          ? formatCurrency(displayCard.sellPrice)
                          : 'Sin precio de venta'}
                      </span>
                    </div>
                  </div>
                  {loadingMetrics && needsMetrics ? (
                    <PriceMetricsSkeleton />
                  ) : (
                    displayCard.cardMetrics &&
                    (displayCard.cardMetrics.ungradedPrice ||
                      displayCard.cardMetrics.gradedPriceSeven ||
                      displayCard.cardMetrics.gradedPriceEightOrAbove) && (
                      <div className='mt-1 flex flex-wrap items-center gap-2 text-xs'>
                        {displayCard.cardMetrics.ungradedPrice &&
                          displayCard.cardMetrics.ungradedPrice > 0 && (
                            <div className='flex items-center gap-0.5'>
                              <Icon
                                icon='lucide:trending-up'
                                width={12}
                                className='text-default-400'
                              />
                              <span className='text-default-500'>
                                Market:{' '}
                                {formatCurrency(
                                  displayCard.cardMetrics.ungradedPrice
                                )}
                              </span>
                            </div>
                          )}
                        {displayCard.cardMetrics.gradedPriceSeven &&
                          displayCard.cardMetrics.gradedPriceSeven > 0 && (
                            <div className='flex items-center gap-0.5'>
                              <Icon
                                icon='lucide:award'
                                width={12}
                                className='text-warning'
                              />
                              <span className='text-default-500'>
                                PSA 7:{' '}
                                {formatCurrency(
                                  displayCard.cardMetrics.gradedPriceSeven
                                )}
                              </span>
                            </div>
                          )}
                        {displayCard.cardMetrics.gradedPriceEightOrAbove &&
                          displayCard.cardMetrics.gradedPriceEightOrAbove >
                            0 && (
                            <div className='flex items-center gap-0.5'>
                              <Icon
                                icon='lucide:star'
                                width={12}
                                className='text-success'
                              />
                              <span className='text-default-500'>
                                PSA 8+:{' '}
                                {formatCurrency(
                                  displayCard.cardMetrics
                                    .gradedPriceEightOrAbove
                                )}
                              </span>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
                {onRemove && (
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove();
                      }
                    }}
                    className='text-default-400 hover:text-danger hover:bg-danger-50 cursor-pointer rounded-md p-1 transition-colors'
                    aria-label='Eliminar carta'
                  >
                    <Icon icon='lucide:x' width={20} />
                  </div>
                )}
              </div>
            }
          >
            <div className='flex flex-col gap-4 px-2 pb-3'>
              {availableRelatedCards.length > 0 && (
                <BulkCardRelatedSelector
                  relatedCards={availableRelatedCards}
                  selectedCardGuid={selectedCardGuid}
                  onSelect={handleSelectRelatedCard}
                  tcgType={tcgType}
                />
              )}

              <div className='flex flex-col gap-2'>
                <p className='text-default-600 text-xs font-semibold'>
                  Configuración:
                </p>
                <BulkCardFormControls
                  variant={variant}
                  index={index}
                  selectedCard={selectedCard}
                />
              </div>
            </div>
          </AccordionItem>
        </Accordion>
        <CardImagePreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          imageUrl={previewImageUrl}
          alt={previewAlt}
          tcgType={previewTcgType}
        />
      </KidstopCard>
    );
  }
);

export default BulkCardResultCard;
