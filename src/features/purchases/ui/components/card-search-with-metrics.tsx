'use client';

import { useCallback, useState } from 'react';
import {
  Button,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

import Search from '@/shared/base/heorui-overrides/search';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { CardCondition, ICardSearchResult, IPurchaseItem } from '../../domain/types';
import { CARD_CONDITIONS, CARD_CONDITION_OPTIONS } from '../../domain/constants';
import { useCardSearch } from '../hooks/use-card-search';

interface CardSearchWithMetricsProps {
  onAddItem: (item: IPurchaseItem) => void;
  existingItemIds: Set<string>;
}

const formatCurrency = (value: number): string =>
  `$${value.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date: string | null): string => {
  if (!date) return 'Sin ventas';
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

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

  const handleAdd = useCallback(() => {
    if (addState.unitBuyPrice <= 0 || addState.quantity < 1) return;
    onAdd(card, addState);
    setAddState({
      ...DEFAULT_ADD_STATE,
      unitBuyPrice: Math.round(card.metrics.referencePrice * 0.6 * 100) / 100,
    });
  }, [card, addState, onAdd]);

  const { metrics } = card;

  return (
    <KidstopCard className="w-full">
      <CardBody className="flex flex-col gap-4 !p-4 sm:flex-row">
        <div className="flex gap-3 sm:w-[200px] sm:shrink-0">
          <div className="relative h-[100px] w-[72px] shrink-0 overflow-hidden rounded-md bg-default-100">
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                sizes="72px"
                className="object-contain p-1"
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

        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-5">
          <MetricItem
            icon="lucide:tag"
            label="Precio ref."
            value={formatCurrency(metrics.referencePrice)}
            valueClassName="text-accent font-semibold"
          />
          <MetricItem
            icon="lucide:package"
            label="Stock"
            value={String(metrics.currentStock)}
            valueClassName={
              metrics.currentStock === 0
                ? 'text-danger font-semibold'
                : 'font-semibold'
            }
          />
          <MetricItem
            icon="lucide:calendar"
            label="Última venta"
            value={formatDate(metrics.lastSaleDate)}
          />
          <MetricItem
            icon="lucide:clock"
            label="En inventario"
            value={formatDaysInInventory(metrics.daysInInventory)}
            valueClassName={
              metrics.daysInInventory > 30
                ? 'text-warning font-semibold'
                : ''
            }
          />
          <MetricItem
            icon="lucide:heart"
            label="Wishlist"
            value={String(metrics.wishlistCount)}
            valueClassName={
              metrics.wishlistCount >= 10
                ? 'text-accent font-semibold'
                : ''
            }
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-default-200 pt-3 sm:w-[320px] sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <div className="grid grid-cols-3 gap-2">
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
                startContent={<Icon icon="lucide:plus" width={16} />}
                onPress={handleAdd}
                isDisabled={
                  isAlreadyAdded ||
                  addState.unitBuyPrice <= 0 ||
                  addState.quantity < 1
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
        id: `${card.id}-${state.condition}-${Date.now()}`,
        cardId: card.id,
        cardName: card.name,
        cardImageUrl: card.imageUrl,
        setName: card.setName,
        setCode: card.setCode,
        tcgType: card.tcgType,
        condition: state.condition,
        quantity: state.quantity,
        unitBuyPrice: state.unitBuyPrice,
        unitSellPrice: card.metrics.referencePrice,
      };
      onAddItem(item);
    },
    [onAddItem]
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
              key={card.id}
              card={card}
              onAdd={handleAddCard}
              isAlreadyAdded={existingItemIds.has(card.id)}
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
