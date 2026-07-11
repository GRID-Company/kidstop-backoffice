import { useState, useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { DEFAULT_CARD_LANGUAGE } from '@/lib/types/language.types';
import { CardCondition } from '../../domain/types';
import { useUpdateInventoryPrice } from './use-update-inventory-price';
import { useAdjustInventoryStock } from './use-adjust-inventory-stock';
import { useCardPriceForm } from '../../adapters/forms/use-card-price-form';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import { toCardPriceFormDefaults } from '../../adapters/mappers/card.mapper';
import { TCGType } from '@/lib/types/tcg.types';
import { BulkOperationType, CardLanguage } from '@/lib/api/schema-types';

export interface InventoryCard {
  cardGuid: string;
  inventoryItemGuid?: string;
  isNew?: boolean;
  condition: string;
  language: CardLanguage;
  stock: number;
  purchasePrice: number | null;
  sellPrice: number | null;
}

interface CardDetail {
  language?: CardLanguage;
  inventoryCards?: Array<{
    guid: string;
    condition: string;
    language: CardLanguage;
    stock: number;
    purchasePrice: number | null;
    sellPrice: number | null;
  }>;
  name?: string;
}

interface CardBasic {
  guid: string;
  language?: CardLanguage;
}

interface UseCardDetailModalParams {
  detail: CardDetail | null;
  card: CardBasic | null;
  tcgType: TCGType;
  onRefetch: () => void;
}

export function useCardDetailModal({
  detail,
  card,
  tcgType,
  onRefetch,
}: UseCardDetailModalParams) {
  const [selectedVariant, setSelectedVariant] = useState<InventoryCard | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState<CardLanguage>(
    card?.language || DEFAULT_CARD_LANGUAGE
  );
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);
  const [stockNotes, setStockNotes] = useState<string>('');
  const [priceNotes, setPriceNotes] = useState<string>('');
  const [movementType, setMovementType] = useState<BulkOperationType>(
    BulkOperationType.ManualEntry
  );
  const { handleUpdatePrice, loading: updatingPrice } =
    useUpdateInventoryPrice();
  const { handleAdjustStock, loading: adjustLoading } =
    useAdjustInventoryStock();
  const { control, handleSubmit, formState, reset } = useCardPriceForm();

  // Sync selectedLanguage with detail's language when detail loads
  useEffect(() => {
    if (detail?.language) {
      setSelectedLanguage(detail.language);
    }
  }, [detail]);

  const availableVariants = useMemo(() => {
    if (!detail?.inventoryCards || !card?.guid) return [];
    return detail.inventoryCards
      .map((ic) => ({
        cardGuid: card.guid,
        inventoryItemGuid: ic.guid,
        condition: ic.condition,
        language: ic.language,
        stock: ic.stock,
        purchasePrice: ic.purchasePrice,
        sellPrice: ic.sellPrice,
      }))
      .filter((item: InventoryCard) => item.language === selectedLanguage);
  }, [detail?.inventoryCards, selectedLanguage, card?.guid]);

  useEffect(() => {
    if (availableVariants.length > 0) {
      const nmVariant = availableVariants.find(
        (v: InventoryCard) => v.condition === CARD_CONDITIONS.NEAR_MINT
      );
      setSelectedVariant(nmVariant ?? availableVariants[0]);
    } else if (card?.guid) {
      setSelectedVariant({
        cardGuid: card.guid,
        inventoryItemGuid: undefined,
        isNew: true,
        condition: CARD_CONDITIONS.NEAR_MINT,
        language: selectedLanguage,
        stock: 0,
        purchasePrice: null,
        sellPrice: null,
      });
    } else {
      setSelectedVariant(null);
    }
  }, [availableVariants, selectedLanguage, card]);

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

  const handleLanguageChange = useCallback((language: CardLanguage) => {
    setSelectedLanguage(language);
  }, []);

  const handlePriceSubmit: SubmitHandler<CardPriceFormData> = useCallback(
    async (data) => {
      if (!detail || !selectedVariant) return;

      try {
        await handleUpdatePrice({
          cardGuid: selectedVariant.cardGuid,
          inventoryItemGuid: selectedVariant.inventoryItemGuid,
          condition: selectedVariant.condition,
          language: selectedVariant.language,
          purchasePrice: data.buyPrice,
          sellPrice: data.sellPrice,
          notes: priceNotes.trim() || undefined,
          tcgType,
        });
        setPriceNotes('');
        onRefetch();
      } catch {
        // Error ya manejado en handleUpdatePrice
      }
    },
    [detail, selectedVariant, handleUpdatePrice, priceNotes, tcgType, onRefetch]
  );

  const executeStockAdjust = useCallback(async () => {
    if (!detail || !selectedVariant || stockAdjustment === 0) return;
    try {
      await handleAdjustStock({
        cardGuid: selectedVariant.cardGuid,
        condition: selectedVariant.condition,
        language: selectedVariant.language,
        quantity: stockAdjustment,
        notes: stockNotes.trim() || undefined,
        tcgType,
        operationType: movementType,
      });
      setStockAdjustment(0);
      setStockNotes('');
      onRefetch();
    } catch {
      // Error ya manejado en handleAdjustStock
    }
  }, [
    detail,
    selectedVariant,
    stockAdjustment,
    stockNotes,
    handleAdjustStock,
    tcgType,
    movementType,
    onRefetch,
  ]);

  return {
    selectedVariant,
    selectedLanguage,
    availableVariants,
    handleLanguageChange,
    stockAdjustment,
    setStockAdjustment,
    stockNotes,
    setStockNotes,
    priceNotes,
    setPriceNotes,
    movementType,
    setMovementType,
    handleVariantSelect,
    handlePriceSubmit,
    executeStockAdjust,
    control,
    handleSubmit,
    formState,
    updatingPrice,
    adjustLoading,
    cardName: detail?.name,
  };
}
