'use client';

import { useState, useCallback } from 'react';
import { Card, CardBody, Chip, Button, Alert } from '@heroui/react';
import { Icon } from '@iconify/react';
import BulkSearchForm from '../components/bulk-search-form';
import PriceAnalysisPanel from '../components/price-analysis-panel';
import BulkLoadConfirmation from '../components/bulk-load-confirmation';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';
import { useBulkLoadInventory } from '../../adapters/api/use-bulk-lookup';
import { BulkLookupService } from '../../domain/bulk-lookup.service';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';

type Step = 'search' | 'analyze' | 'confirm' | 'complete';

export default function BulkLookupComplete() {
  const [currentStep, setCurrentStep] = useState<Step>('search');
  const {
    rawText,
    searchResults,
    priceAnalysis,
    selectedItems,
    isSearching,
    isLoadingMetrics,
    isLoading,
    error,
    setSearchResults,
    setPriceAnalysis,
    setIsSearching,
    setIsLoadingMetrics,
    setIsLoading,
    setError,
    reset,
  } = useBulkLookupStore();

  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const { bulkLoad } = useBulkLoadInventory();

  const handleSearch = useCallback(async () => {
    if (!rawText.trim() || !selectedTCG) return;

    setIsSearching(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when codegen is ready
      console.log('Searching for cards:', { rawText, selectedTCG });

      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Parse results and call batch search query
      setSearchResults([]);
      setCurrentStep('analyze');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during search');
    } finally {
      setIsSearching(false);
    }
  }, [rawText, selectedTCG, setIsSearching, setError, setSearchResults, setCurrentStep]);

  const handleAnalyze = useCallback(async () => {
    if (searchResults.length === 0) return;

    setIsLoadingMetrics(true);
    setError(null);

    try {
      // TODO: Fetch metrics for each card and enrich analysis
      console.log('Fetching metrics for cards:', searchResults);

      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Call metrics queries and calculate analysis
      setPriceAnalysis([]);
      setCurrentStep('confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching metrics');
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [searchResults, setIsLoadingMetrics, setError, setPriceAnalysis, setCurrentStep]);

  const handleConfirm = useCallback(async () => {
    if (selectedItems.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const validation = BulkLookupService.validateBulkLoadItems(selectedItems);
      if (!validation.valid) {
        setError(validation.errors.join('; '));
        return;
      }

      // TODO: Call bulkLoadInventory mutation when backend is ready
      const result = await bulkLoad({ items: selectedItems });

      if (!result.success) {
        setError(result.errors.join('; '));
        return;
      }

      setCurrentStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading inventory');
    } finally {
      setIsLoading(false);
    }
  }, [selectedItems, setIsLoading, setError, bulkLoad, setCurrentStep]);

  const handleReset = () => {
    reset();
    setCurrentStep('search');
  };

  const steps: { id: Step; label: string; icon: string }[] = [
    { id: 'search', label: 'Buscar', icon: 'lucide:search' },
    { id: 'analyze', label: 'Analizar', icon: 'lucide:bar-chart-3' },
    { id: 'confirm', label: 'Confirmar', icon: 'lucide:check-circle' },
    { id: 'complete', label: 'Completado', icon: 'lucide:check-circle-2' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => {
                    if (index <= currentStepIndex) {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={index > currentStepIndex}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    index <= currentStepIndex
                      ? 'bg-primary text-white cursor-pointer'
                      : 'bg-default-200 text-default-500 cursor-not-allowed'
                  }`}
                >
                  <Icon icon={step.icon} width={20} />
                </button>
                <p className="ml-2 text-sm font-medium">{step.label}</p>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-default-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert
          color="danger"
          title="Error"
          description={error}
          startContent={<Icon icon="lucide:alert-circle" />}
          onClose={() => setError(null)}
        />
      )}

      {/* Step Content */}
      <div className="flex flex-col gap-4">
        {currentStep === 'search' && (
          <>
            <BulkSearchForm onSearch={handleSearch} isLoading={isSearching} />
            {searchResults.length > 0 && (
              <Card>
                <CardBody>
                  <p className="text-sm text-default-500 mb-2">
                    Se encontraron {searchResults.length} cartas
                  </p>
                  <Button
                    color="primary"
                    onPress={handleAnalyze}
                    isLoading={isLoadingMetrics}
                  >
                    Continuar al análisis
                  </Button>
                </CardBody>
              </Card>
            )}
          </>
        )}

        {currentStep === 'analyze' && (
          <>
            <PriceAnalysisPanel analysis={priceAnalysis} />
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <Button
                  color="primary"
                  onPress={() => setCurrentStep('confirm')}
                  className="flex-1"
                >
                  Continuar a confirmación ({selectedItems.length} cartas)
                </Button>
                <Button
                  variant="flat"
                  onPress={() => setCurrentStep('search')}
                >
                  Volver
                </Button>
              </div>
            )}
          </>
        )}

        {currentStep === 'confirm' && (
          <>
            <BulkLoadConfirmation
              items={selectedItems}
              onConfirm={handleConfirm}
              isLoading={isLoading}
              error={error}
            />
            {selectedItems.length > 0 && (
              <Button
                variant="flat"
                onPress={() => setCurrentStep('analyze')}
                isDisabled={isLoading}
              >
                Volver a editar
              </Button>
            )}
          </>
        )}

        {currentStep === 'complete' && (
          <Card className="bg-success-50 border border-success">
            <CardBody className="flex items-center justify-center py-8 gap-4">
              <Icon icon="lucide:check-circle-2" width={48} className="text-success" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-success mb-2">
                  ¡Carga completada!
                </h3>
                <p className="text-sm text-default-600 mb-4">
                  Se han cargado {selectedItems.length} cartas al inventario
                </p>
                <Button color="primary" onPress={handleReset}>
                  Realizar otra carga
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
