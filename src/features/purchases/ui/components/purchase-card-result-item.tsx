'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import {
  Button,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Skeleton,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import KidstopCard from '@/shared/base/heorui-overrides/card';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/format-date';
import { formatDaysInInventory } from '@/lib/utils/format-inventory';
import {
  CardCondition,
  ICardSearchResult,
  IPurchaseItem,
} from '../../domain/types';
import {
  CARD_CONDITIONS,
  CARD_CONDITION_OPTIONS,
} from '../../domain/constants';
import { getItemKey } from '../../domain/purchases.domain';
import { CardLanguage } from '@/lib/api/schema-types';
import { DEFAULT_CARD_LANGUAGE } from '@/lib/types/language.types';
import { LanguageSelector } from '@/shared/components/language-selector';
import { useCardVariantMetrics } from '../hooks/use-card-variant-metrics';
import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import {
  validateOfferPrice,
  validateQuantity,
} from '../../adapters/forms/offer-price.form.schema';
import { calculateOfferPrice } from '@/lib/utils/price.utils';
import { mapCardSearchResultToPurchaseItem } from '../../adapters/mappers/card-search-result-to-purchase-item.mapper';
import CardConditionBreakdownPopover from './condition-breakdown-popover';

interface AddToCartState {
  condition: CardCondition;
  language: CardLanguage;
  quantity: number;
  unitBuyPrice: number;
}

const DEFAULT_ADD_STATE: AddToCartState = {
  condition: CARD_CONDITIONS.NEAR_MINT,
  language: DEFAULT_CARD_LANGUAGE,
  quantity: 1,
  unitBuyPrice: 0,
};

const EMPTY_ITEM_IDS = new Set<string>();

const WISHLIST_HIGHLIGHT_THRESHOLD = 10;

interface PurchaseCardResultItemProps {
  card: ICardSearchResult;
  onAdd: (item: IPurchaseItem) => void | Promise<void>;
  existingItemIds?: Set<string>;
  isBestMatch?: boolean;
  stacked?: boolean;
}

export default function PurchaseCardResultItem({
  card,
  onAdd,
  existingItemIds = EMPTY_ITEM_IDS,
  isBestMatch = false,
  stacked = false,
}: PurchaseCardResultItemProps) {
  const [addState, setAddState] = useState<AddToCartState>({
    ...DEFAULT_ADD_STATE,
    language: card.language || DEFAULT_CARD_LANGUAGE,
    unitBuyPrice: calculateOfferPrice(card.metrics.referencePrice),
  });
  const [isAdding, setIsAdding] = useState(false);
  const isPrivacyMode = usePrivacyModeStore((state) => state.isPrivacyMode);

  const isAlreadyAdded = useMemo(
    () =>
      existingItemIds.has(
        getItemKey({
          cardGuid: card.guid,
          condition: addState.condition,
          language: addState.language,
        })
      ),
    [existingItemIds, card.guid, addState.condition, addState.language]
  );

  const {
    metrics: variantMetrics,
    referencePrice,
    variantsMetrics,
    loading: metricsLoading,
  } = useCardVariantMetrics(card.guid, addState.condition, card.tcgType);

  useEffect(() => {
    if (referencePrice !== null) {
      const calculatedPrice = calculateOfferPrice(referencePrice);
      setAddState((s) => ({ ...s, unitBuyPrice: calculatedPrice }));
    }
  }, [referencePrice, addState.condition]);

  const handleAdd = useCallback(async () => {
    if (addState.unitBuyPrice <= 0 || addState.quantity < 1) return;
    if (isAlreadyAdded) return;
    setIsAdding(true);
    try {
      const item = mapCardSearchResultToPurchaseItem(
        card,
        {
          condition: addState.condition,
          language: addState.language,
          quantity: addState.quantity,
          offerPrice: addState.unitBuyPrice,
        },
        referencePrice ?? card.metrics.referencePrice
      );
      await onAdd(item);
      const resetPrice =
        referencePrice !== null
          ? calculateOfferPrice(referencePrice)
          : calculateOfferPrice(card.metrics.referencePrice);
      setAddState({
        ...DEFAULT_ADD_STATE,
        unitBuyPrice: resetPrice,
      });
    } finally {
      setIsAdding(false);
    }
  }, [card, addState, onAdd, referencePrice, isAlreadyAdded]);

  const displayMetrics = variantMetrics || card.metrics;

  return (
    <KidstopCard className='w-full'>
      <CardBody
        className={`flex flex-col gap-3 !p-3 ${stacked ? '' : 'xl:flex-row xl:gap-4 xl:!p-4'}`}
      >
        <div
          className={`flex gap-3 ${stacked ? '' : 'xl:w-[200px] xl:shrink-0'}`}
        >
          <div className='bg-default-100 relative h-[90px] w-[65px] shrink-0 overflow-hidden rounded-md xl:h-[100px] xl:w-[72px]'>
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className='absolute inset-0 h-full w-full object-contain p-1'
              />
            ) : (
              <div className='text-default-400 flex h-full items-center justify-center'>
                <Icon icon='lucide:image-off' width={24} />
              </div>
            )}
          </div>
          <div className='flex flex-col justify-center gap-1'>
            <p className='text-sm leading-tight font-semibold'>{card.name}</p>
            <p className='text-default-500 text-xs'>
              {card.setName} · {card.setCode}
            </p>
            <p className='text-default-400 text-xs'>
              #{card.number} {card.rarity ? `· ${card.rarity}` : ''}
            </p>
          </div>
        </div>

        <div
          className={`grid flex-1 grid-cols-3 gap-x-2 gap-y-1.5 ${stacked ? '' : 'xl:grid-cols-5 xl:gap-x-4 xl:gap-y-2'}`}
        >
          {metricsLoading ? (
            <>
              <Skeleton className='h-10 rounded-md' />
              <Skeleton className='h-10 rounded-md' />
              <Skeleton className='h-10 rounded-md' />
              {!stacked && (
                <>
                  <div className='hidden xl:block'>
                    <Skeleton className='h-10 rounded-md' />
                  </div>
                  <div className='hidden xl:block'>
                    <Skeleton className='h-10 rounded-md' />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <MetricItem
                icon='lucide:tag'
                label='Precio ref.'
                value={
                  isPrivacyMode
                    ? '***'
                    : formatCurrency(
                        referencePrice ?? card.metrics.referencePrice
                      )
                }
                valueClassName='text-accent font-semibold'
              />
              <MetricItem
                icon='lucide:package'
                label='Stock'
                value={String(variantMetrics?.stock ?? 0)}
                valueClassName={
                  (variantMetrics?.stock ?? 0) === 0
                    ? 'text-danger font-semibold'
                    : 'font-semibold'
                }
              />
              <MetricItem
                icon='lucide:heart'
                label='Wishlist'
                value={String(displayMetrics.wishlistCount)}
                valueClassName={
                  displayMetrics.wishlistCount >= WISHLIST_HIGHLIGHT_THRESHOLD
                    ? 'text-accent font-semibold'
                    : ''
                }
                endContent={
                  <CardConditionBreakdownPopover
                    variantsMetrics={variantsMetrics}
                  />
                }
              />
              {!stacked && (
                <>
                  <div className='hidden xl:block'>
                    <MetricItem
                      icon='lucide:calendar'
                      label='Última venta'
                      value={formatDate(
                        displayMetrics.lastSaleDate,
                        'Sin ventas'
                      )}
                    />
                  </div>
                  <div className='hidden xl:block'>
                    <MetricItem
                      icon='lucide:clock'
                      label='En inventario'
                      value={formatDaysInInventory(
                        displayMetrics.daysInInventory
                      )}
                      valueClassName={
                        displayMetrics.daysInInventory > 30
                          ? 'text-warning font-semibold'
                          : ''
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div
          className={`border-default-200 flex flex-col gap-2 border-t pt-2 ${stacked ? '' : 'xl:w-[380px] xl:shrink-0 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-4'}`}
        >
          {isBestMatch && (
            <div className='flex justify-end'>
              <Chip size='sm' variant='flat' color='success'>
                Mejor coincidencia
              </Chip>
            </div>
          )}
          <div
            className={`grid grid-cols-2 gap-1.5 ${stacked ? '' : 'xl:grid-cols-4 xl:gap-2'}`}
          >
            <LanguageSelector
              value={addState.language}
              onChange={(language) => setAddState((s) => ({ ...s, language }))}
              tcgType={card.tcgType}
              currentLanguage={card.language}
              size='sm'
              label='Idioma'
            />

            <Select
              aria-label='Condición'
              size='sm'
              variant='bordered'
              selectedKeys={new Set([addState.condition])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as CardCondition;
                if (selected)
                  setAddState((s) => ({ ...s, condition: selected }));
              }}
              classNames={{
                trigger: 'border-[1px] bg-white',
                label: 'text-xs',
              }}
              label='Condición'
            >
              {CARD_CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>

            <Input
              aria-label='Cantidad'
              type='number'
              size='sm'
              variant='bordered'
              label='Cant.'
              min={1}
              value={String(addState.quantity)}
              onValueChange={(val) => {
                const { isValid, quantity: qty } = validateQuantity(val);
                if (isValid) {
                  setAddState((s) => ({ ...s, quantity: qty }));
                }
              }}
              classNames={{
                inputWrapper: 'border-[1px] bg-white',
                input: 'text-center',
                label: 'text-xs',
              }}
            />

            <Input
              aria-label='Precio por carta'
              type='number'
              size='sm'
              variant='bordered'
              label='Precio por carta'
              min={0}
              step={0.01}
              value={String(addState.unitBuyPrice)}
              onValueChange={(val) => {
                const { isValid, price } = validateOfferPrice(val);
                if (isValid) {
                  setAddState((s) => ({ ...s, unitBuyPrice: price }));
                }
              }}
              startContent={<span className='text-default-400 text-xs'>$</span>}
              classNames={{
                inputWrapper: 'border-[1px] bg-white',
                input: 'text-right',
                label: 'text-xs',
              }}
            />
          </div>

          <Tooltip
            content={isAlreadyAdded ? 'Esta carta ya está en la compra' : ''}
            isDisabled={!isAlreadyAdded}
          >
            <div>
              <Button
                size='sm'
                className='bg-accent w-full text-white'
                startContent={
                  !isAdding && <Icon icon='lucide:plus' width={16} />
                }
                onPress={handleAdd}
                isLoading={isAdding}
                isDisabled={
                  isAlreadyAdded ||
                  addState.unitBuyPrice <= 0 ||
                  addState.quantity < 1 ||
                  isAdding
                }
              >
                {isAlreadyAdded ? 'Ya agregada' : 'Agregar a compra'}
              </Button>
            </div>
          </Tooltip>
        </div>
      </CardBody>
    </KidstopCard>
  );
}

function MetricItem({
  icon,
  label,
  value,
  valueClassName = '',
  endContent,
}: {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
  endContent?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-0.5'>
      <div className='flex items-center gap-1'>
        <Icon icon={icon} width={12} className='text-default-400' />
        <span className='text-default-400 text-[10px]'>{label}</span>
      </div>
      <div className='flex items-center gap-1'>
        <span className={`text-xs ${valueClassName}`}>{value}</span>
        {endContent}
      </div>
    </div>
  );
}
