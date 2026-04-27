'use client';

import { useEffect, useState, useMemo } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { useBulkCardSearch } from './hooks/use-bulk-card-search';
import { useBulkSearchForm } from './hooks/use-bulk-search-form';
import BulkCardSearchInput from './bulk-card-search-input';
import BulkCardSearchResults from './bulk-card-search-results';
import { BulkCardSearchProps } from './types';

function BulkCardSearchFooter({ 
  variant, 
  fields, 
  onCancel 
}: { 
  variant: 'purchases' | 'inventory'; 
  fields: any[]; 
  onCancel: () => void;
}) {
  const cardsData = useWatch({ name: 'cards' });

  const configuredCount = useMemo(() => {
    if (!cardsData || !Array.isArray(cardsData)) return 0;
    
    return cardsData.filter((card: any) => {
      if (!card) return false;
      
      const hasValidGuid = !!card.selectedCardGuid;
      const hasValidCondition = !!card.condition;
      const hasValidQuantity = typeof card.quantity === 'number' && card.quantity > 0 && !isNaN(card.quantity);
      const hasValidPrice = variant === 'purchases'
        ? typeof card.offerPrice === 'number' && card.offerPrice >= 0 && !isNaN(card.offerPrice)
        : typeof card.publicPrice === 'number' && card.publicPrice >= 0 && !isNaN(card.publicPrice);
      
      return hasValidGuid && hasValidCondition && hasValidQuantity && hasValidPrice;
    }).length;
  }, [cardsData, variant]);

  if (fields.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-default-200 pt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-default-700">
            {configuredCount} de {fields.length} {fields.length === 1 ? 'carta configurada' : 'cartas configuradas'}
          </p>
          {configuredCount < fields.length && (
            <p className="text-xs text-warning">
              Faltan {fields.length - configuredCount} {fields.length - configuredCount === 1 ? 'carta' : 'cartas'} por configurar
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="flat" onPress={onCancel}>
            Cancelar
          </Button>
          <Button
            color="primary"
            type="submit"
            startContent={<Icon icon="lucide:check" />}
            isDisabled={fields.length === 0}
          >
            Confirmar y agregar
          </Button>
        </div>
      </div>
    </div>
  );
}

function BulkCardSearchRoot({ variant, onConfirm, onCancel, isOpen = true }: BulkCardSearchProps) {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [searchText, setSearchText] = useState('');

  const { search, results, loading, error, reset: resetSearch } = useBulkCardSearch();

  const { form, fields, initializeCards, resetForm } = useBulkSearchForm(variant, onConfirm as any);

  useEffect(() => {
    if (results.length > 0) {
      initializeCards(results);
    }
  }, [results, initializeCards]);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    form.setValue('searchText', searchText);
    await search(searchText, selectedTCG);
  };

  const handleClear = () => {
    setSearchText('');
    resetSearch();
    resetForm();
  };

  const handleSubmit = form.handleSubmit(
    (data) => {
      onConfirm(data as any);
      handleClear();
    },
    (errors) => {
      toast.error('Por favor completa todos los campos requeridos');
    }
  );

  const handleCancel = () => {
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <BulkCardSearchInput
          value={searchText}
          onChange={setSearchText}
          onSearch={handleSearch}
          onClear={handleClear}
          isLoading={loading}
        />

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-danger bg-danger-50 p-3">
            <Icon icon="lucide:alert-circle" width={20} className="text-danger" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        <BulkCardSearchResults
          results={results}
          variant={variant}
          tcgType={selectedTCG}
          isLoading={loading}
        />

        <BulkCardSearchFooter
          variant={variant}
          fields={fields}
          onCancel={handleCancel}
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
