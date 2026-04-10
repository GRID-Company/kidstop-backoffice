'use client';

import { useCallback, useState, useEffect } from 'react';
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

import Search from '@/shared/base/heorui-overrides/search';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/format-date';
import { CardCondition, ICardSearchResult, IPurchaseItem } from '../../domain/types';
import { CARD_CONDITIONS, CARD_CONDITION_OPTIONS } from '../../domain/constants';
import { useCardSearch } from '../hooks/use-card-search';
import { useCardVariantMetrics } from '../hooks/use-card-variant-metrics';

interface CardSearchWithMetricsProps {
  onAddItem: (item: IPurchaseItem) => void;
  existingItemIds: Set<string>;
}

const formatDaysInInventory = (days: number): string => {
  if (days === 0) return 'Sin stock';
  if (days === 1) return '1 día';
  return `${days} días`;
};

interface AddToCartState {
  condition: CardCondition;
  quantity: number;
  unitBuyPrice: number;
}

const DEFAULT_ADD_STATE: AddToCartState = {
  condition: CARD_CONDITIONS.NEAR_MINT,
  quantity: 1,
  unitBuyPrice: 0,
};

function CardResultItem({
  card,
  onAdd,
  isAlreadyAdded,
}: {
  card: ICardSearchResult;
  onAdd: (card: ICardSearchResult, state: AddToCartState) => void;
  isAlreadyAdded: boolean;
}) {
  const [addState, setAddState] = useState<AddToCartState>({
    ...DEFAULT_ADD_STATE,
    unitBuyPrice: Math.round(card.metrics.referencePrice * 0.6 * 100) / 100,
  });
  const [isAdding, setIsAdding] = useState(false);

  const { metrics: variantMetrics, referencePrice, loading: metricsLoading } = useCardVariantMetrics(
    card.guid,
    addState.condition,
    card.tcgType
  );

  useEffect(() => {
    if (referencePrice !== null) {
      const calculatedPrice = Math.round(referencePrice * 0.6 * 100) / 100;
      setAddState((s) => ({ ...s, unitBuyPrice: calculatedPrice }));
    }
  }, [referencePrice, addState.condition]);

  const handleAdd = useCallback(async () => {
    if (addState.unitBuyPrice <= 0 || addState.quantity < 1) return;
    setIsAdding(true);
    try {
      await onAdd(card, addState);
      const resetPrice = referencePrice !== null 
        ? Math.round(referencePrice * 0.6 * 100) / 100
        : Math.round(card.metrics.referencePrice * 0.6 * 100) / 100;
      setAddState({
        ...DEFAULT_ADD_STATE,
        unitBuyPrice: resetPrice,
      });
    } finally {
      setIsAdding(false);
    }
  }, [card, addState, onAdd, referencePrice]);

  const displayMetrics = variantMetrics || card.metrics;

  return (
    <KidstopCard className="w-full">
      <CardBody className="flex flex-col gap-3 !p-3 xl:flex-row xl:gap-4 xl:!p-4">
        <div className="flex gap-3 xl:w-[200px] xl:shrink-0">
          <div className="relative h-[90px] w-[65px] shrink-0 overflow-hidden rounded-md bg-default-100 xl:h-[100px] xl:w-[72px]">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="absolute inset-0 h-full w-full object-contain p-1"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-default-400">
                <Icon icon="lucide:image-off" width={24} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-1">
            <p className="text-sm font-semibold leading-tight">{card.name}</p>
            <p className="text-xs text-default-500">
              {card.setName} · {card.setCode}
            </p>
            <p className="text-xs text-default-400">
              #{card.number} · {card.rarity}
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-x-2 gap-y-1.5 xl:grid-cols-5 xl:gap-x-4 xl:gap-y-2">
          {metricsLoading ? (
            <>
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <div className="hidden xl:block">
                <Skeleton className="h-10 rounded-md" />
              </div>
              <div className="hidden xl:block">
                <Skeleton className="h-10 rounded-md" />
              </div>
            </>
          ) : (
            <>
              <MetricItem
                icon="lucide:tag"
                label="Precio ref."
                value={formatCurrency(referencePrice ?? card.metrics.referencePrice)}
                valueClassName="text-accent font-semibold"
              />
              <MetricItem
                icon="lucide:package"
                label="Stock"
                value={String(variantMetrics?.stock ?? 0)}
                valueClassName={
                  (variantMetrics?.stock ?? 0) === 0
                    ? 'text-danger font-semibold'
                    : 'font-semibold'
                }
              />
              <MetricItem
                icon="lucide:heart"
                label="Wishlist"
                value={String(displayMetrics.wishlistCount)}
                valueClassName={
                  displayMetrics.wishlistCount >= 10
                    ? 'text-accent font-semibold'
                    : ''
                }
              />
              <div className="hidden xl:block">
                <MetricItem
                  icon="lucide:calendar"
                  label="Última venta"
                  value={formatDate(displayMetrics.lastSaleDate, 'Sin ventas')}
                />
              </div>
              <div className="hidden xl:block">
                <MetricItem
                  icon="lucide:clock"
                  label="En inventario"
                  value={formatDaysInInventory(displayMetrics.daysInInventory)}
                  valueClassName={
                    displayMetrics.daysInInventory > 30
                      ? 'text-warning font-semibold'
                      : ''
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-default-200 pt-2 xl:w-[320px] xl:shrink-0 xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
          <div className="grid grid-cols-3 gap-1.5 xl:gap-2">
            <Select
              aria-label="Condición"
              size="sm"
              variant="bordered"
              selectedKeys={new Set([addState.condition])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as CardCondition;
                if (selected) setAddState((s) => ({ ...s, condition: selected }));
              }}
              classNames={{
                trigger: 'border-[1px] bg-white',
                label: 'text-xs',
              }}
              label="Condición"
            >
              {CARD_CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>

            <Input
              aria-label="Cantidad"
              type="number"
              size="sm"
              variant="bordered"
              label="Cant."
              min={1}
              value={String(addState.quantity)}
              onValueChange={(val) => {
                const qty = parseInt(val, 10);
                if (!isNaN(qty) && qty >= 1) {
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
              aria-label="Precio oferta"
              type="number"
              size="sm"
              variant="bordered"
              label="Oferta"
              min={0}
              step={0.01}
              value={String(addState.unitBuyPrice)}
              onValueChange={(val) => {
                const price = parseFloat(val);
                if (!isNaN(price) && price >= 0) {
                  setAddState((s) => ({ ...s, unitBuyPrice: price }));
                }
              }}
              startContent={
                <span className="text-xs text-default-400">$</span>
              }
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
                size="sm"
                className="w-full bg-accent text-white"
                startContent={!isAdding && <Icon icon="lucide:plus" width={16} />}
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
}: {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        <Icon icon={icon} width={12} className="text-default-400" />
        <span className="text-[10px] text-default-400">{label}</span>
      </div>
      <span className={`text-xs ${valueClassName}`}>{value}</span>
    </div>
  );
}

export default function CardSearchWithMetrics({
  onAddItem,
  existingItemIds,
}: CardSearchWithMetricsProps) {
  const { search, setSearch, results, resetSearch } = useCardSearch();

  const handleAddCard = useCallback(
    (card: ICardSearchResult, state: AddToCartState) => {
      const item: IPurchaseItem = {
        guid: `${card.guid}-${state.condition}-${Date.now()}`,
        cardGuid: card.guid,
        cardName: card.name,
        cardImageUrl: card.imageUrl,
        setName: card.setName,
        setCode: card.setCode,
        tcgType: card.tcgType,
        condition: state.condition,
        quantity: state.quantity,
        offerPrice: state.unitBuyPrice,
        referencePrice: card.metrics.referencePrice,
        sellPrice: card.metrics.referencePrice,
      };
      onAddItem(item);
      resetSearch();
    },
    [onAddItem, resetSearch]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Search
            label="Buscar carta"
            placeholder="Nombre, set o identificador..."
            value={search}
            onValueChange={setSearch}
            aria-label="Buscar carta para agregar a compra"
            isClearable
            onClear={resetSearch}
          />
        </div>
        {search && (
          <Chip size="sm" variant="flat" className="shrink-0">
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </Chip>
        )}
      </div>

      {results.length > 0 ? (
        <div className="flex flex-col gap-3">
          {results.map((card) => (
            <CardResultItem
              key={card.guid}
              card={card}
              onAdd={handleAddCard}
              isAlreadyAdded={existingItemIds.has(card.guid)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-default-400">
          <Icon icon="lucide:search-x" width={40} className="mb-2" />
          <span className="text-sm">
            {search
              ? 'No se encontraron cartas con ese criterio'
              : 'Busca una carta para ver sus métricas'}
          </span>
        </div>
      )}
    </div>
  );
}
