'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
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
  Spinner,
} from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { Icon } from '@iconify/react';
import { SubmitHandler } from 'react-hook-form';
import { useQuery } from '@apollo/client/react';

import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { CARD_CONDITION_SHORT_LABELS, CARD_CONDITION_OPTIONS } from '@/lib/types/card.types';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { PokemonCardInternalListDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardInternalListDocument } from '@/lib/api/generated/catalog-magic.generated';
import { toPokemonCard, toMagicCard } from '@/features/catalog/adapters/mappers/card.mapper';
import { IPokemonCard, IMagicCard } from '@/features/catalog/domain/types';
import { IInventoryItem } from '../../domain/types';
import { fromApiInventoryItem } from '../../adapters/mappers/inventory.mapper';
import {
  MOVEMENT_TYPES,
  ADJUSTMENT_TYPE_OPTIONS,
  STOCK_STATUS_LABELS,
  STOCK_STATUS_COLORS,
} from '../../domain/constants';
import { validateStock } from '../../domain/inventory.domain';
import { useAdjustmentForm } from '../../adapters/forms/use-adjustment-form';
import { InventoryAdjustmentFormData } from '../../adapters/forms/inventory-adjustment.form.schema';
import { toAdjustmentFormDefaults } from '../../adapters/mappers/inventory.mapper';

interface AdjustmentModalProps {
  item: IInventoryItem | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit?: (data: InventoryAdjustmentFormData) => void | Promise<void>;
}

type CatalogCard = IPokemonCard | IMagicCard;

export default function AdjustmentModal({
  item,
  isOpen,
  isSubmitting = false,
  onClose,
  onSubmit,
}: AdjustmentModalProps) {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [resolvedItem, setResolvedItem] = useState<IInventoryItem | null>(item);
  const [itemSearch, setItemSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<CatalogCard | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setResolvedItem(item);
      setItemSearch('');
      setSelectedCard(null);
      setSelectedCondition('');
    }
  }, [isOpen, item]);

  const isPokemon = selectedTCG === TCG_TYPES.POKEMON;

  const { data: pokemonData, loading: pokemonLoading } = useQuery(PokemonCardInternalListDocument, {
    variables: {
      findPokemonCardsPublicArgs: {
        skip: 0,
        limit: 6,
        search: itemSearch.trim() || undefined,
        sort: { column: 'releaseDate', order: 'DESC' },
        filters: {},
      },
    },
    skip: !isPokemon || !!resolvedItem || itemSearch.trim().length < 2,
    fetchPolicy: 'network-only',
  });

  const { data: magicData, loading: magicLoading } = useQuery(MagicCardInternalListDocument, {
    variables: {
      findMagicCardsPublicArgs: {
        skip: 0,
        limit: 6,
        search: itemSearch.trim() || undefined,
        sort: { column: 'releaseDate', order: 'DESC' },
        filters: {},
      },
    },
    skip: isPokemon || !!resolvedItem || itemSearch.trim().length < 2,
    fetchPolicy: 'network-only',
  });

  const searchLoading = isPokemon ? pokemonLoading : magicLoading;

  const searchResults = useMemo<CatalogCard[]>(() => {
    if (isPokemon) {
      const raw = pokemonData?.pokemonCardInternalList?.data;
      if (!raw) return [];
      return raw
        .filter((card): card is NonNullable<typeof card> => card != null)
        .map(toPokemonCard);
    } else {
      const raw = magicData?.magicCardInternalList?.data;
      if (!raw) return [];
      return raw
        .filter((card): card is NonNullable<typeof card> => card != null)
        .map(toMagicCard);
    }
  }, [isPokemon, pokemonData, magicData]);

  const handleCardSelect = useCallback((card: CatalogCard) => {
    setSelectedCard(card);
    setSelectedCondition('');
  }, []);

  const handleConditionSelect = useCallback((condition: string) => {
    if (!selectedCard) return;
    
    const variant = selectedCard.variants.find(v => v.condition === condition);
    const stock = variant?.stock ?? 0;
    
    const simulatedItem: IInventoryItem = {
      guid: variant?.guid ?? '',
      cardGuid: selectedCard.guid,
      name: selectedCard.name,
      setName: 'setName' in selectedCard ? selectedCard.setName ?? '' : selectedCard.edition ?? '',
      setCode: 'setCode' in selectedCard ? selectedCard.setCode ?? '' : '',
      number: 'cardNumber' in selectedCard ? selectedCard.cardNumber ?? '' : selectedCard.collectorNumber ?? '',
      rarity: ('rarity' in selectedCard ? selectedCard.rarity : null) ?? '',
      imageUrl: selectedCard.imageUri ?? '',
      tcg: selectedTCG,
      condition: condition as any,
      stock,
      stockStatus: stock > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
      purchasePrice: variant?.purchasePrice ?? 0,
      sellPrice: variant?.sellPrice ?? selectedCard.sellPrice ?? 0,
      lastSellDate: null,
      avgDaysInInventory: null,
    };
    
    setResolvedItem(simulatedItem);
    setSelectedCard(null);
    setSelectedCondition('');
  }, [selectedCard, selectedTCG]);

  const { control, handleSubmit, formState, reset, watch } = useAdjustmentForm();

  useEffect(() => {
    if (resolvedItem) {
      reset({
        ...toAdjustmentFormDefaults(resolvedItem),
        quantity: 1,
        movementType: MOVEMENT_TYPES.MANUAL_ADJUSTMENT,
        notes: '',
      });
    }
  }, [resolvedItem, reset]);

  const movementType = watch('movementType');
  const quantity = watch('quantity');

  const isExit = movementType === MOVEMENT_TYPES.SALE_EXIT;

  const stockError = useMemo(() => {
    if (!resolvedItem || !isExit) return null;
    if (!validateStock(resolvedItem.stock, -quantity)) {
      return `Stock insuficiente. Disponible: ${resolvedItem.stock}`;
    }
    return null;
  }, [resolvedItem, isExit, quantity]);

  const handleFormSubmit: SubmitHandler<InventoryAdjustmentFormData> = useCallback(
    (data) => {
      if (!resolvedItem || !onSubmit) return;
      if (data.movementType === MOVEMENT_TYPES.SALE_EXIT && !validateStock(resolvedItem.stock, -data.quantity)) return;
      onSubmit(data);
    },
    [resolvedItem, onSubmit]
  );

  return (
    <KidstopDrawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">Ajuste de inventario</span>
          <span className="text-sm font-normal text-default-500">
            Registrar movimiento manual de stock
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          {!resolvedItem && !selectedCard ? (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Buscar carta por nombre, set o código..."
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
                  {searchResults.map((result) => {
                    const setName = 'setName' in result ? result.setName : result.edition;
                    const number = 'cardNumber' in result ? result.cardNumber : result.collectorNumber;
                    return (
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
                              src={isPokemon ? pokemonCardPlaceholder : magicCardPlaceholder}
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
                            {setName} · #{number}
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
                    );
                  })}
                </div>
              )}

              {itemSearch.trim().length < 2 && (
                <p className="text-center text-sm text-default-400">
                  Escribe al menos 2 caracteres para buscar
                </p>
              )}
            </div>
          ) : selectedCard ? (
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
                      src={isPokemon ? pokemonCardPlaceholder : magicCardPlaceholder}
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
                    {'setName' in selectedCard ? selectedCard.setName : selectedCard.edition} · #{'cardNumber' in selectedCard ? selectedCard.cardNumber : selectedCard.collectorNumber}
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
          ) : resolvedItem ? (
            <>
              <div className="flex gap-4 rounded-lg bg-default-50 p-4">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-default-100">
                  {resolvedItem.imageUrl ? (
                    <img
                      src={resolvedItem.imageUrl}
                      alt={resolvedItem.name}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={resolvedItem.tcg === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder}
                      alt="Card placeholder"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-sm font-semibold">{resolvedItem.name}</p>
                  <p className="truncate text-xs text-default-500">
                    {resolvedItem.setName} ({resolvedItem.setCode}) · #{resolvedItem.number}
                  </p>
                  <div className="flex items-center gap-2">
                    <Chip
                      size="sm"
                      variant="flat"
                      classNames={{ base: 'bg-default-100', content: 'text-default-600' }}
                    >
                      {CARD_CONDITION_SHORT_LABELS[resolvedItem.condition] ?? resolvedItem.condition}
                    </Chip>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={STOCK_STATUS_COLORS[resolvedItem.stockStatus] ?? 'default'}
                    >
                      {STOCK_STATUS_LABELS[resolvedItem.stockStatus]} · {resolvedItem.stock}
                    </Chip>
                  </div>
                </div>

                {!item && (
                <button
                  type="button"
                  onClick={() => { setResolvedItem(null); setItemSearch(''); }}
                  className="self-start text-default-400 hover:text-default-700"
                  aria-label="Cambiar carta"
                >
                  <Icon icon="lucide:x" />
                </button>
              )}
              </div>

              <Divider />

              <form
                id="adjustment-form"
                onSubmit={(...args) => { void handleSubmit(handleFormSubmit)(...args); }}
                className="flex flex-col gap-4"
              >
                <SelectForm
                  label="Tipo de ajuste"
                  placeholder="Selecciona el tipo de movimiento"
                  items={ADJUSTMENT_TYPE_OPTIONS}
                  controlProps={{ control, name: 'movementType' }}
                  isRequired
                  aria-label="Tipo de ajuste de inventario"
                />

                <InputForm
                  label="Cantidad"
                  type="number"
                  min={1}
                  controlProps={{ control, name: 'quantity' }}
                  isRequired
                  description={isExit ? `Stock disponible: ${resolvedItem.stock}` : undefined}
                  isInvalid={!!stockError}
                  errorMessage={stockError ?? undefined}
                  aria-label="Cantidad a ajustar"
                />

                <TextareaForm
                  label="Notas / Razón"
                  placeholder="Describe el motivo del ajuste"
                  controlProps={{ control, name: 'notes' }}
                  minRows={3}
                  maxRows={5}
                  aria-label="Notas del ajuste"
                />
              </form>
            </>
          ) : null}
        </DrawerBody>

        <DrawerFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>
          {resolvedItem && (
            <Button
              type="submit"
              form="adjustment-form"
              isDisabled={!formState.isValid || !!stockError || isSubmitting}
              isLoading={isSubmitting}
              startContent={<Icon icon="lucide:save" />}
              className="text-white"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Registrar ajuste
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </KidstopDrawer>
  );
}
