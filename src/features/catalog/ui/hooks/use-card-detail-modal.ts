import { useState, useCallback, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { CardCondition } from '../../domain/types';
import { useUpdateInventoryPrice } from './use-update-inventory-price';
import { useAdjustInventoryStock } from './use-adjust-inventory-stock';
import { useCardPriceForm } from '../../adapters/forms/use-card-price-form';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import { toCardPriceFormDefaults } from '../../adapters/mappers/card.mapper';
import { TCGType } from '@/lib/types/tcg.types';
import { BulkOperationType } from '@/lib/api/schema-types';

export interface InventoryCard {
  guid: string;
  isNew?: boolean;
  condition: string;
  stock: number;
  purchasePrice: number | null;
  sellPrice: number | null;
}

interface UseCardDetailModalParams {
  detail: any;
  card: any;
  tcgType: TCGType;
  onRefetch: () => void;
}

export function useCardDetailModal({
  detail,
  card,
  tcgType,
  onRefetch,
}: UseCardDetailModalParams) {
  const [selectedVariant, setSelectedVariant] = useState<InventoryCard | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);
  const [movementType, setMovementType] = useState<BulkOperationType>(BulkOperationType.ManualEntry);
  const { handleUpdatePrice, loading: updatingPrice } = useUpdateInventoryPrice();
  const { handleAdjustStock, loading: adjustLoading } = useAdjustInventoryStock();
  const { control, handleSubmit, formState, reset } = useCardPriceForm();

  useEffect(() => {
    if (detail?.inventoryCards && detail.inventoryCards.length > 0) {
      const nmVariant = detail.inventoryCards.find(
        (v: InventoryCard) => v.condition === CARD_CONDITIONS.NEAR_MINT
      );
      setSelectedVariant(nmVariant ?? detail.inventoryCards[0]);
    } else if (card?.guid) {
      setSelectedVariant({
        guid: `${card.guid}-${CARD_CONDITIONS.NEAR_MINT}`,
        isNew: true,
        condition: CARD_CONDITIONS.NEAR_MINT,
        stock: 0,
        purchasePrice: null,
        sellPrice: null,
      });
    } else {
      setSelectedVariant(null);
    }
  }, [detail, card]);

  useEffect(() => {
    if (selectedVariant) {
      reset(
        toCardPriceFormDefaults({
          id: selectedVariant.condition,
          condition: selectedVariant.condition as CardCondition,
          stock: selectedVariant.stock,
          buyPrice: selectedVariant.purchasePrice ?? 0,
          sellPrice: selectedVariant.sellPrice ?? 0,
        })
      );
    }
  }, [selectedVariant, reset]);

  const handleVariantSelect = useCallback((variant: InventoryCard) => {
    setSelectedVariant(variant);
  }, []);

  const handlePriceSubmit: SubmitHandler<CardPriceFormData> = useCallback(
    async (data) => {
      if (!detail || !selectedVariant) return;

      const existingInventoryItemGuid = selectedVariant.isNew ? undefined : selectedVariant.guid;

      await handleUpdatePrice({
        cardGuid: detail.guid,
        inventoryItemGuid: existingInventoryItemGuid,
        condition: selectedVariant.condition,
        purchasePrice: data.buyPrice,
        sellPrice: data.sellPrice,
        tcgType,
      });
      onRefetch();
    },
    [detail, selectedVariant, handleUpdatePrice, tcgType, onRefetch]
  );

  const handleStockAdjust = useCallback(async () => {
    if (!detail || !selectedVariant || stockAdjustment === 0) return;
    await handleAdjustStock({
      cardGuid: detail.guid,
      condition: selectedVariant.condition,
      quantity: stockAdjustment,
      tcgType,
      operationType: movementType,
    });
    setStockAdjustment(0);
    onRefetch();
  }, [detail, selectedVariant, stockAdjustment, handleAdjustStock, tcgType, movementType, onRefetch]);

  return {
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
  };
}
