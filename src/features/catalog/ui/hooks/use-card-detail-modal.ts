import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { CARD_CONDITIONS } from '@/lib/types/card.types';
import { DEFAULT_CARD_LANGUAGE } from '@/lib/types/language.types';
import { CardCondition } from '../../domain/types';
import { useUpdateInventoryPrice } from './use-update-inventory-price';
import { useAdjustInventoryStock } from './use-adjust-inventory-stock';
import { useCardPriceForm } from '../../adapters/forms/use-card-price-form';
import { useStockAdjustmentForm } from '../../adapters/forms/use-stock-adjustment-form';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import { toCardPriceFormDefaults } from '../../adapters/mappers/card.mapper';
import { TCGType } from '@/lib/types/tcg.types';
import { CardLanguage } from '@/lib/api/schema-types';
import { isStockAdjustmentDisabled } from '../../domain/catalog.domain';

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
  const isInitialLoadRef = useRef(true);

  const { handleUpdatePrice, loading: updatingPrice } =
    useUpdateInventoryPrice();
  const { handleAdjustStock, loading: adjustLoading } =
    useAdjustInventoryStock();

  const { control, handleSubmit, formState, reset, watch } = useCardPriceForm();
  const stockForm = useStockAdjustmentForm();

  // Sync selectedLanguage with detail's language only on initial load
  useEffect(() => {
    if (detail?.language && isInitialLoadRef.current) {
      setSelectedLanguage(detail.language);
      isInitialLoadRef.current = false;
    }
  }, [detail?.language]);

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
      // Try to preserve the current condition
      const currentCondition = selectedVariant?.condition;
      const sameConditionVariant = currentCondition
        ? availableVariants.find(
            (v: InventoryCard) => v.condition === currentCondition
          )
        : null;

      if (sameConditionVariant) {
        // Preserve selected condition
        setSelectedVariant(sameConditionVariant);
      } else {
        // Fallback: NM or first available
        const nmVariant = availableVariants.find(
          (v: InventoryCard) => v.condition === CARD_CONDITIONS.NEAR_MINT
        );
        setSelectedVariant(nmVariant ?? availableVariants[0]);
      }
    } else if (card?.guid) {
      setSelectedVariant((prev) => ({
        cardGuid: card.guid,
        inventoryItemGuid: undefined,
        isNew: true,
        condition: prev?.condition ?? CARD_CONDITIONS.NEAR_MINT,
        language: selectedLanguage,
        stock: 0,
        purchasePrice: null,
        sellPrice: null,
      }));
    } else {
      setSelectedVariant(null);
    }
  }, [availableVariants, selectedLanguage, card]);

  // Reset isInitialLoadRef when card changes
  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [card?.guid]);

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
          notes: data.notes?.trim() || undefined,
          tcgType,
        });
        reset();
        onRefetch();
      } catch {
        // Error ya manejado en handleUpdatePrice
      }
    },
    [detail, selectedVariant, handleUpdatePrice, tcgType, onRefetch, reset]
  );

  const executeStockAdjust = useCallback(async () => {
    const formValues = stockForm.getValues();
    if (
      !detail ||
      !selectedVariant ||
      isStockAdjustmentDisabled(formValues.quantity, formValues.movementType)
    )
      return;
    try {
      await handleAdjustStock({
        cardGuid: selectedVariant.cardGuid,
        condition: selectedVariant.condition,
        language: selectedVariant.language,
        quantity: formValues.quantity,
        notes: formValues.notes?.trim() || undefined,
        tcgType,
        operationType: formValues.movementType,
      });
      stockForm.reset();
      onRefetch();
    } catch {
      // Error ya manejado en handleAdjustStock
    }
  }, [
    detail,
    selectedVariant,
    stockForm,
    handleAdjustStock,
    tcgType,
    onRefetch,
  ]);

  return {
    selectedVariant,
    selectedLanguage,
    availableVariants,
    handleLanguageChange,
    handleVariantSelect,
    handlePriceSubmit,
    executeStockAdjust,
    control,
    handleSubmit,
    formState,
    watch,
    updatingPrice,
    adjustLoading,
    cardName: detail?.name,
    stockControl: stockForm.control,
    stockFormState: stockForm.formState,
    stockWatch: stockForm.watch,
  };
}
