'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { isValidPrice, isValidQuantity } from '@/lib/utils/validation.utils';
import { useBulkCardSearch } from './hooks/use-bulk-card-search';
import { useBulkSearchForm } from './hooks/use-bulk-search-form';
import BulkCardSearchInput from './bulk-card-search-input';
import BulkCardSearchResults from './bulk-card-search-results';
import {
  BulkCardSearchProps,
  BulkSearchFormDataPurchases,
  BulkSearchFormDataInventory,
  BulkCardResult,
  BulkCardSearchResultsHandle,
} from './types';
import { getValidCardFormIndex } from './utils';

function BulkCardSearchFooter({
  variant,
  fields,
  onCancel,
  onScrollToUnconfigured,
}: {
  variant: 'purchases' | 'inventory';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[]; // React Hook Form field array
  onCancel: () => void;
  onScrollToUnconfigured: () => void;
}) {
  const cardsData = useWatch({ name: 'cards' });

  const configuredCount = useMemo(() => {
    if (!cardsData || !Array.isArray(cardsData)) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return cardsData.filter((card: any) => {
      if (!card) return false;

      const hasValidGuid = !!card.selectedCardGuid;
      const hasValidCondition = !!card.condition;
      const hasValidQuantity = isValidQuantity(card.quantity);
      const hasValidPrice =
        variant === 'purchases'
          ? isValidPrice(card.offerPrice)
          : isValidPrice(card.publicPrice);

      return (
        hasValidGuid && hasValidCondition && hasValidQuantity && hasValidPrice
      );
    }).length;
  }, [cardsData, variant]);

  if (fields.length === 0) return null;

  return (
    <div className='border-default-200 flex flex-col gap-3 border-t pt-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex flex-col gap-1'>
          <p className='text-default-700 text-sm font-semibold'>
            {configuredCount} de {fields.length}{' '}
            {fields.length === 1 ? 'carta configurada' : 'cartas configuradas'}
          </p>
          {configuredCount < fields.length && (
            <button
              type='button'
              onClick={onScrollToUnconfigured}
              className='text-warning hover:text-warning-600 cursor-pointer text-left text-xs underline decoration-dotted underline-offset-2 transition-colors'
            >
              Faltan {fields.length - configuredCount}{' '}
              {fields.length - configuredCount === 1 ? 'carta' : 'cartas'} por
              configurar
            </button>
          )}
        </div>
        <div className='flex gap-2'>
          <Button variant='flat' onPress={onCancel}>
            Cancelar
          </Button>
          <Button
            className='text-white'
            style={{ backgroundColor: 'var(--color-accent)' }}
            type='submit'
            startContent={<Icon icon='lucide:check' />}
            isDisabled={fields.length === 0 || configuredCount < fields.length}
          >
            Confirmar y agregar
          </Button>
        </div>
      </div>
    </div>
  );
}

function BulkCardSearchRoot({
  variant,
  onConfirm,
  onCancel,
  isOpen = true,
}: BulkCardSearchProps) {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState<BulkCardResult[]>([]);
  const resultsRef = useRef<BulkCardSearchResultsHandle>(null);

  const {
    search,
    results,
    loading,
    error,
    successfulCount,
    totalCount,
    reset: resetSearch,
  } = useBulkCardSearch();

  const { form, fields, initializeCards, resetForm, removeCard } =
    useBulkSearchForm(variant);

  useEffect(() => {
    if (results.length > 0) {
      setFilteredResults(results);
      initializeCards(results);
    }
  }, [results, initializeCards]);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    form.setValue('searchText', searchText);
    await search(searchText, selectedTCG);
  };

  /**
   * Removes a card from the filtered results and optionally from the form.
   * Error cards are only removed from UI, valid cards are removed from both UI and form.
   * @param index - Index of the result to remove in the filteredResults array
   */
  const handleRemoveResult = useCallback(
    (index: number) => {
      const resultToRemove = filteredResults[index];
      const newFilteredResults = filteredResults.filter((_, i) => i !== index);
      setFilteredResults(newFilteredResults);

      if (resultToRemove?.bestMatch && !resultToRemove?.error) {
        const formFieldIndex = getValidCardFormIndex(filteredResults, index);
        removeCard(formFieldIndex);
      }
    },
    [filteredResults, removeCard]
  );

  const handleClear = () => {
    setSearchText('');
    setFilteredResults([]);
    resetSearch();
    resetForm();
  };

  /**
   * Handles form submission by filtering out error cards and notifying the user.
   * Only valid cards (without errors) are passed to the onConfirm callback.
   * If any cards with errors are present, the user is notified via toast.
   */
  const handleSubmit = form.handleSubmit(
    (data) => {
      const validResults = filteredResults.filter((result) => !result.error);
      const errorCount = filteredResults.length - validResults.length;

      if (errorCount > 0) {
        toast(
          `Se omitieron ${errorCount} ${errorCount === 1 ? 'carta' : 'cartas'} con error`,
          { icon: 'ℹ️' }
        );
      }

      onConfirm(
        data as BulkSearchFormDataPurchases & BulkSearchFormDataInventory,
        validResults
      );
      handleClear();
    },
    (_errors) => {
      toast.error('Por favor completa todos los campos requeridos');
    }
  );

  const handleCancel = () => {
    onCancel();
  };

  const handleScrollToUnconfigured = () => {
    resultsRef.current?.scrollToFirstUnconfigured();
  };

  if (!isOpen) return null;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <BulkCardSearchInput
          value={searchText}
          onChange={setSearchText}
          onSearch={handleSearch}
          onClear={handleClear}
          isLoading={loading}
        />

        {error && (
          <div className='border-danger bg-danger-50 flex items-center gap-2 rounded-lg border p-3'>
            <Icon
              icon='lucide:alert-circle'
              width={20}
              className='text-danger'
            />
            <p className='text-danger text-sm'>{error}</p>
          </div>
        )}

        {!loading && filteredResults.length > 0 && totalCount > 0 && (
          <div className='border-default-200 bg-default-50 flex items-center gap-2 rounded-lg border p-3'>
            <Icon
              icon='lucide:search-check'
              width={20}
              className='text-success'
            />
            <p className='text-default-700 text-sm'>
              Encontradas{' '}
              <span className='font-semibold'>{successfulCount}</span> de{' '}
              <span className='font-semibold'>{totalCount}</span>{' '}
              {totalCount === 1 ? 'carta' : 'cartas'}
            </p>
          </div>
        )}

        <BulkCardSearchResults
          ref={resultsRef}
          results={filteredResults}
          variant={variant}
          tcgType={selectedTCG}
          isLoading={loading}
          onRemove={handleRemoveResult}
        />

        <BulkCardSearchFooter
          variant={variant}
          fields={fields}
          onCancel={handleCancel}
          onScrollToUnconfigured={handleScrollToUnconfigured}
        />
      </form>
    </FormProvider>
  );
}

const BulkCardSearch = Object.assign(BulkCardSearchRoot, {
  Input: BulkCardSearchInput,
  Results: BulkCardSearchResults,
});

export default BulkCardSearch;
