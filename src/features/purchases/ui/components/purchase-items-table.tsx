'use client';

import { useCallback, useMemo, useEffect, useState } from 'react';
import { Button, Chip, Tooltip, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';

import OverrideInput from '@/shared/base/heorui-overrides/input';
import KidstopSelect from '@/shared/base/heorui-overrides/select';
import Search from '@/shared/base/heorui-overrides/search';
import { KidstopPagination } from '@/shared/base/heorui-overrides/pagination';

import { usePrivacyCurrency } from '@/lib/hooks/use-privacy-currency';
import { formatCurrency } from '@/lib/utils/format-currency';
import { TCGType, TCG_TYPES } from '@/lib/types/tcg.types';
import { IPokemonCard, IMagicCard } from '@/features/catalog/domain/types';
import PokemonCardDetailModal from '@/features/catalog/ui/components/pokemon-card-detail-modal';
import MagicCardDetailModal from '@/features/catalog/ui/components/magic-card-detail-modal';
import { ITableColumn } from '@/lib/types/datatable.types';
import { DataTable } from '@/shared/blocks/data-table/data-table';
import { CardImage } from '@/shared/components/card-image';
import CardAttributeChips from '@/shared/components/card-attribute-chips';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { CardCondition, IPurchaseItem } from '../../domain/types';
import {
  CARD_CONDITION_OPTIONS,
  CARD_CONDITION_SHORT_LABELS,
} from '../../domain/constants';
import {
  calculateItemSubtotal,
  calculateSellTotal,
  calculateTotal,
} from '../../domain/purchases.domain';
import { useItemsReferencePrices } from '../hooks/use-items-reference-prices';
import { usePurchaseItemsTableFilters } from '../hooks/use-purchase-items-table-filters';
import {
  validateOfferPrice,
  validateQuantity,
} from '../../adapters/forms/offer-price.form.schema';
import SellPriceCell from './sell-price-cell';

interface PurchaseItemsTableProps {
  items: IPurchaseItem[];
  onUpdateItem: (itemId: string, updates: Partial<IPurchaseItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onRefetchPrices?: (refetch: (items?: IPurchaseItem[]) => void) => void;
  showRefreshButton?: boolean;
  tcgType?: TCGType;
  isReadOnly?: boolean;
  canEditSellPrice?: boolean;
  onSellPriceSave?: (
    item: IPurchaseItem,
    sellPrice: number
  ) => void | Promise<void>;
}

export default function PurchaseItemsTable({
  items,
  onUpdateItem,
  onRemoveItem,
  onRefetchPrices,
  showRefreshButton = false,
  tcgType,
  isReadOnly = false,
  canEditSellPrice = false,
  onSellPriceSave,
}: PurchaseItemsTableProps) {
  const displayCurrency = usePrivacyCurrency();
  const {
    itemsWithPrices,
    loading,
    refetch: refetchPrices,
  } = useItemsReferencePrices(items);
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();
  const {
    search,
    setSearch,
    condition,
    setCondition,
    language,
    setLanguage,
    page,
    setPage,
    filteredItems,
    paginatedItems,
    totalPages,
    languageOptions,
    hasActiveFilters,
    resetFilters,
  } = usePurchaseItemsTableFilters(itemsWithPrices);
  const [detailItem, setDetailItem] = useState<IPurchaseItem | null>(null);

  useEffect(() => {
    if (onRefetchPrices) {
      onRefetchPrices(refetchPrices);
    }
  }, [refetchPrices, onRefetchPrices]);

  const total = useMemo(() => calculateTotal(items), [items]);
  const sellTotal = useMemo(() => calculateSellTotal(items), [items]);
  const showSellTotal = useMemo(
    () => items.some((item) => (item.sellPrice ?? 0) > 0),
    [items]
  );

  const refreshButtonClassName = useMemo(() => {
    if (!tcgType) return '';
    return tcgType === 'POKEMON'
      ? 'bg-[#e53223] text-white hover:bg-[#991b1b]'
      : 'bg-[#e85d26] text-white hover:bg-[#9a3412]';
  }, [tcgType]);

  const handleQuantityChange = useCallback(
    (itemId: string, value: string) => {
      const { isValid, quantity } = validateQuantity(value);
      if (isValid) {
        onUpdateItem(itemId, { quantity });
      }
    },
    [onUpdateItem]
  );

  const handleConditionChange = useCallback(
    (itemId: string, value: string) => {
      if (value) {
        onUpdateItem(itemId, { condition: value as CardCondition });
      }
    },
    [onUpdateItem]
  );

  const handleOfferPriceChange = useCallback(
    (itemId: string, value: string) => {
      const { isValid, price } = validateOfferPrice(value);
      if (isValid) {
        onUpdateItem(itemId, { offerPrice: price });
      }
    },
    [onUpdateItem]
  );

  const toCatalogCard = useCallback(
    (item: IPurchaseItem): IPokemonCard | IMagicCard => {
      const stock = item.metrics?.currentStock ?? 0;
      const variants = [
        {
          guid: item.guid,
          condition: item.condition,
          stock,
          purchasePrice: item.offerPrice,
          sellPrice: item.sellPrice ?? null,
        },
      ];
      if (item.tcgType === TCG_TYPES.MAGIC) {
        return {
          guid: item.cardGuid,
          name: item.cardName,
          edition: item.setName,
          collectorNumber: item.collectorNumber ?? item.cardNumber ?? null,
          isFoil: item.isFoil ?? false,
          rarity: item.rarity ?? null,
          sellPrice: item.sellPrice ?? null,
          availableStock: stock > 0,
          totalStock: stock,
          imageUri: item.cardImageUrl || null,
          language: item.language,
          variants,
        };
      }
      return {
        guid: item.cardGuid,
        name: item.cardName,
        cardNumber: item.cardNumber ?? item.collectorNumber ?? null,
        setName: item.setName,
        setCode: item.setCode,
        variant: item.variant,
        language: item.language,
        sellPrice: item.sellPrice ?? null,
        availableStock: stock > 0,
        totalStock: stock,
        imageUri: item.cardImageUrl || null,
        type: item.type,
        hp: item.hp,
        stage: item.stage,
        variants,
      };
    },
    []
  );

  const closeDetail = useCallback(() => setDetailItem(null), []);

  const columns: ITableColumn<IPurchaseItem>[] = useMemo(() => {
    const baseCols: ITableColumn<IPurchaseItem>[] = [
      {
        key: 'card',
        label: 'Carta',
        className: '!text-left min-w-[240px]',
        customCol: (item: IPurchaseItem) => (
          <div className='flex items-center gap-3'>
            <CardImage
              src={item.cardImageUrl}
              alt={item.cardName}
              tcgType={item.tcgType}
              containerClassName='relative h-12 w-9 rounded overflow-hidden bg-default-100 flex-shrink-0'
              className='object-cover'
              fill
              sizes='36px'
              enablePreview
              onImageClick={() =>
                openPreview(item.cardImageUrl, item.cardName, item.tcgType)
              }
            />
            <div className='flex flex-col items-start gap-0.5'>
              <span
                className='text-left text-sm leading-tight font-medium'
                data-testid='purchase-item-card-name'
                data-item-guid={item.guid}
              >
                {item.cardName}
              </span>
              <span
                className='text-default-400 text-xs'
                data-testid='purchase-item-card-set'
                data-item-guid={item.guid}
              >
                {item.setName} · {item.setCode}
              </span>
              <CardAttributeChips
                tcgType={item.tcgType}
                isFoil={item.isFoil}
                variant={item.variant}
                language={item.language}
                type={item.type}
                hp={item.hp}
                stage={item.stage}
                rarity={item.rarity}
              />
              {item.metrics?.currentStock !== undefined && (
                <span className='text-default-400 text-[10px]'>
                  Stock: {item.metrics.currentStock}
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'condition',
        label: 'Condición',
        className: 'min-w-[140px]',
        customCol: (item: IPurchaseItem) =>
          isReadOnly ? (
            <span className='text-sm'>
              {
                CARD_CONDITION_SHORT_LABELS[
                  item.condition as keyof typeof CARD_CONDITION_SHORT_LABELS
                ]
              }
            </span>
          ) : (
            <KidstopSelect
              aria-label='Condición'
              size='sm'
              variant='bordered'
              selectedKeys={new Set([item.condition])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleConditionChange(item.guid, selected);
              }}
              classNames={{
                trigger: 'border-[1px] bg-white w-full',
              }}
            >
              {CARD_CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </KidstopSelect>
          ),
      },
      {
        key: 'quantity',
        label: 'Cantidad',
        className: 'w-[110px]',
        customCol: (item: IPurchaseItem) =>
          isReadOnly ? (
            <span className='text-sm'>{item.quantity}</span>
          ) : (
            <OverrideInput
              aria-label='Cantidad'
              data-testid='purchase-item-quantity-input'
              data-item-guid={item.guid}
              type='number'
              size='sm'
              variant='bordered'
              min={1}
              value={String(item.quantity)}
              onValueChange={(val) => handleQuantityChange(item.guid, val)}
              classNames={{
                inputWrapper: 'border-[1px] bg-white w-full',
                input: 'text-center',
              }}
            />
          ),
      },
      {
        key: 'unitBuyPrice',
        label: 'Precio compra',
        className: 'min-w-[130px]',
        customCol: (item: IPurchaseItem) =>
          isReadOnly ? (
            <span className='text-sm font-medium'>
              {displayCurrency(item.offerPrice)}
            </span>
          ) : (
            <OverrideInput
              aria-label='Precio de compra'
              data-testid='purchase-item-offer-price-input'
              data-item-guid={item.guid}
              type='text'
              inputMode='numeric'
              size='sm'
              variant='bordered'
              maxLength={12}
              value={item.offerPrice.toLocaleString('es-MX', {
                maximumFractionDigits: 0,
              })}
              onValueChange={(val) =>
                handleOfferPriceChange(item.guid, val.replace(/[^\d.]/g, ''))
              }
              startContent={<span className='text-default-400 text-xs'>$</span>}
              classNames={{
                inputWrapper: 'border-[1px] bg-white w-full pr-1',
                input: 'text-right pr-6',
              }}
            />
          ),
      },
      {
        key: 'referencePriceAdded',
        label: 'Ref. al agregar',
        className: 'w-[110px]',
        customCol: (item: IPurchaseItem) => (
          <span className='text-sm font-medium'>
            {displayCurrency(item.referencePrice ?? 0)}
          </span>
        ),
      },
      {
        key: 'referencePriceCurrent',
        label: 'Ref. actual',
        className: 'w-[110px]',
        customCol: (item: IPurchaseItem) => (
          <span className='text-sm font-medium'>
            {displayCurrency(item.currentReferencePrice ?? 0)}
          </span>
        ),
      },
      {
        key: 'sellPrice',
        label: 'Precio venta',
        className: 'min-w-[130px]',
        customCol: (item: IPurchaseItem) =>
          canEditSellPrice && onSellPriceSave ? (
            <SellPriceCell
              key={`${item.guid}-${item.sellPrice ?? 'none'}`}
              item={item}
              onSave={onSellPriceSave}
            />
          ) : (
            <span
              className='text-sm font-medium'
              data-testid='purchase-item-sell-price'
              data-item-guid={item.guid}
            >
              {item.sellPrice !== undefined
                ? displayCurrency(item.sellPrice)
                : '—'}
            </span>
          ),
      },
      {
        key: 'subtotal',
        label: 'Subtotal',
        customCol: (item: IPurchaseItem) => (
          <span
            className='text-sm font-semibold'
            data-testid='purchase-item-subtotal'
            data-item-guid={item.guid}
          >
            {formatCurrency(calculateItemSubtotal(item))}
          </span>
        ),
      },
    ];

    baseCols.push({
      key: 'actions',
      label: '',
      className: 'w-[110px]',
      customCol: (item: IPurchaseItem) => (
        <div className='flex items-center justify-center gap-1'>
          {!isReadOnly && (
            <Tooltip content='Eliminar item' color='danger'>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                color='danger'
                data-testid='purchase-item-remove'
                data-item-guid={item.guid}
                onPress={() => onRemoveItem(item.guid)}
                aria-label={`Eliminar ${item.cardName}`}
              >
                <Icon icon='lucide:trash-2' width={16} />
              </Button>
            </Tooltip>
          )}
          <Tooltip content='Ver detalle de la carta'>
            <Button
              isIconOnly
              size='sm'
              variant='light'
              data-testid='purchase-item-view-detail'
              data-item-guid={item.guid}
              onPress={() => setDetailItem(item)}
              aria-label={`Ver detalle de ${item.cardName}`}
            >
              <Icon icon='lucide:eye' width={16} />
            </Button>
          </Tooltip>
        </div>
      ),
    });

    return baseCols;
  }, [
    isReadOnly,
    canEditSellPrice,
    onSellPriceSave,
    displayCurrency,
    handleQuantityChange,
    handleConditionChange,
    handleOfferPriceChange,
    onRemoveItem,
    openPreview,
  ]);

  return (
    <div className='flex flex-col gap-3' data-testid='purchase-items-table'>
      <div className='flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end'>
        <div className='lg:min-w-[260px] lg:flex-1'>
          <Search
            aria-label='Buscar item de la compra'
            label='Buscar items'
            placeholder='Buscar por nombre, set o número...'
            value={search}
            onValueChange={setSearch}
            isClearable
            data-testid='purchase-items-search'
          />
        </div>
        <div className='flex flex-wrap items-end gap-2'>
          <KidstopSelect
            aria-label='Filtrar por condición'
            label='Condición'
            placeholder='Todas las condiciones'
            items={CARD_CONDITION_OPTIONS}
            selectedKeys={condition ? [condition] : []}
            onChange={(e) => setCondition(e.target.value)}
            data-testid='purchase-items-condition-filter'
            className='w-full sm:w-[190px]'
            classNames={{ trigger: 'border-[1px] bg-white' }}
          />
          <KidstopSelect
            aria-label='Filtrar por idioma'
            label='Idioma'
            placeholder='Todos los idiomas'
            items={languageOptions}
            selectedKeys={language ? [language] : []}
            onChange={(e) => setLanguage(e.target.value)}
            data-testid='purchase-items-language-filter'
            className='w-full sm:w-[180px]'
            classNames={{ trigger: 'border-[1px] bg-white' }}
          />
          {hasActiveFilters && (
            <Button
              size='sm'
              variant='light'
              className='text-default-500 mb-2'
              data-testid='purchase-items-clear-filters'
              onPress={resetFilters}
            >
              Limpiar
            </Button>
          )}
          {showRefreshButton && (
            <Tooltip content='Consulta el precio de mercado actual de las cartas'>
              <Button
                variant='bordered'
                className={`h-14 ${refreshButtonClassName}`}
                data-testid='purchase-items-refresh'
                startContent={
                  loading ? (
                    <Icon
                      icon='lucide:loader-2'
                      width={16}
                      className='animate-spin'
                    />
                  ) : (
                    <Icon icon='lucide:refresh-cw' width={16} />
                  )
                }
                onPress={() => refetchPrices(items)}
                isDisabled={loading || items.length === 0}
              >
                {loading
                  ? 'Actualizando...'
                  : 'Actualizar precios de referencia'}
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className='flex items-center gap-2'>
          <Chip size='sm' variant='flat' data-testid='purchase-items-count'>
            {filteredItems.length}{' '}
            {filteredItems.length === 1 ? 'resultado' : 'resultados'}
          </Chip>
        </div>
      )}

      {paginatedItems.length > 0 ? (
        <>
          <DataTable<IPurchaseItem>
            cols={columns}
            data={paginatedItems}
            isLoading={false}
          />
          {totalPages > 1 && (
            <div
              className='flex justify-center'
              data-testid='purchase-items-pagination'
            >
              <KidstopPagination
                page={page}
                total={totalPages}
                onChange={setPage}
                size='sm'
                showControls
              />
            </div>
          )}
        </>
      ) : (
        <div
          className='text-default-400 flex flex-col items-center justify-center py-8'
          data-testid='purchase-items-empty'
        >
          <Icon
            icon={
              items.length === 0 ? 'lucide:package-open' : 'lucide:search-x'
            }
            width={40}
            className='mb-2'
          />
          <span className='text-sm'>
            {items.length === 0
              ? 'No hay items en la compra'
              : 'No se encontraron items con esos filtros'}
          </span>
        </div>
      )}

      {items.length > 0 && (
        <div className='border-default-200 flex justify-end gap-6 border-t pt-3'>
          {showSellTotal && (
            <div className='flex items-center gap-2'>
              <span className='text-default-500 text-sm'>Total venta:</span>
              <span
                className='text-lg font-bold'
                data-testid='purchase-items-sell-total'
              >
                {formatCurrency(sellTotal)}
              </span>
            </div>
          )}
          <div className='flex items-center gap-2'>
            <span className='text-default-500 text-sm'>Total compra:</span>
            <span
              className='text-accent text-lg font-bold'
              data-testid='purchase-items-total'
            >
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}

      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />

      <PokemonCardDetailModal
        card={
          detailItem?.tcgType === TCG_TYPES.POKEMON
            ? (toCatalogCard(detailItem) as IPokemonCard)
            : null
        }
        isOpen={detailItem?.tcgType === TCG_TYPES.POKEMON}
        onClose={closeDetail}
      />
      <MagicCardDetailModal
        card={
          detailItem?.tcgType === TCG_TYPES.MAGIC
            ? (toCatalogCard(detailItem) as IMagicCard)
            : null
        }
        isOpen={detailItem?.tcgType === TCG_TYPES.MAGIC}
        onClose={closeDetail}
      />
    </div>
  );
}
