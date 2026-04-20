'use client';

import { useState, useCallback } from 'react';
import { Card, CardBody, Divider, Button, Alert, Accordion, AccordionItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import BulkSearchForm from '../components/bulk-search-form';
import DeckListResultsTable from '../components/deck-list-results-table';
import PriceAnalysisPanel from '../components/price-analysis-panel';
import BulkLoadConfirmation from '../components/bulk-load-confirmation';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';
import { useBulkLoadInventory, useMagicBatchSearch, usePokemonBatchSearch, useMagicCardMetrics, usePokemonCardMetrics } from '../../adapters/api/use-bulk-lookup';
import { BulkLookupService } from '../../domain/bulk-lookup.service';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { parseDeckListText } from '../../domain/deck-list-parser';

export default function BulkLookupModular() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['search']);

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
  const { search: searchMagic } = useMagicBatchSearch();
  const { search: searchPokemon } = usePokemonBatchSearch();
  const { getMetrics: getMagicMetrics } = useMagicCardMetrics();
  const { getMetrics: getPokemonMetrics } = usePokemonCardMetrics();

  const handleSearch = useCallback(async () => {
    if (!rawText.trim() || !selectedTCG) return;

    setIsSearching(true);
    setError(null);

    try {
      // Parse the deck list text
      const parsedLines = parseDeckListText(rawText);
      
      if (parsedLines.length === 0) {
        setError('No valid card lines found in the list');
        setIsSearching(false);
        return;
      }

      // Extract card names for batch search
      const searchText = parsedLines
        .filter((line) => line.isValid)
        .map((line) => `${line.quantity} ${line.cardName} ${line.setCode} ${line.collectorNumber}`)
        .join('\n');

      // Call the appropriate batch search
      const results = selectedTCG === 'POKEMON'
        ? await searchPokemon({ searchText })
        : await searchMagic({ searchText });

      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during search');
    } finally {
      setIsSearching(false);
    }
  }, [rawText, selectedTCG, setIsSearching, setError, setSearchResults, setExpandedSections, searchMagic, searchPokemon]);

  const handleAnalyze = useCallback(async () => {
    if (searchResults.length === 0) return;

    setIsLoadingMetrics(true);
    setError(null);

    try {
      // Fetch metrics for each card
      const metricsMap: Record<string, any> = {};
      
      for (const result of searchResults) {
        if (result.bestMatch) {
          const metrics = selectedTCG === 'POKEMON'
            ? await getPokemonMetrics(result.bestMatch.guid)
            : await getMagicMetrics(result.bestMatch.guid);
          
          if (metrics) {
            metricsMap[result.bestMatch.guid] = metrics;
          }
        }
      }

      console.log('Metrics map:', metricsMap);
      console.log('Search results:', searchResults);

      // Enrich results with metrics and calculate price analysis
      const analysis = BulkLookupService.enrichWithMetrics(searchResults, metricsMap);
      console.log('Price analysis:', analysis);
      
      setPriceAnalysis(analysis);
      setExpandedSections(['search', 'analyze', 'confirm']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching metrics');
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [searchResults, selectedTCG, setIsLoadingMetrics, setError, setPriceAnalysis, setExpandedSections, getMagicMetrics, getPokemonMetrics]);

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

      reset();
      setExpandedSections(['search']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading inventory');
    } finally {
      setIsLoading(false);
    }
  }, [selectedItems, setIsLoading, setError, bulkLoad, reset, setExpandedSections]);

  return (
    <div className="flex flex-col gap-4">
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

      {/* Accordion Sections */}
      <Accordion
        selectedKeys={expandedSections}
        onSelectionChange={(keys) => setExpandedSections(Array.from(keys) as string[])}
        variant="splitted"
      >
        {/* Búsqueda */}
        <AccordionItem
          key="search"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:search" width={20} />
              <span>Búsqueda de Cartas</span>
              {searchResults.length > 0 && (
                <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                  {searchResults.length} encontradas
                </span>
              )}
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <BulkSearchForm onSearch={handleSearch} isLoading={isSearching} />

            {searchResults.length > 0 && (
              <>
                <Divider />
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold text-sm">Resultados de búsqueda</h4>
                  <DeckListResultsTable lines={[]} />
                  <Button
                    color="primary"
                    onPress={handleAnalyze}
                    isLoading={isLoadingMetrics}
                    className="w-full"
                  >
                    Analizar precios
                  </Button>
                </div>
              </>
            )}
          </div>
        </AccordionItem>

        {/* Análisis de Precios */}
        <AccordionItem
          key="analyze"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:bar-chart-3" width={20} />
              <span>Análisis de Precios</span>
              {selectedItems.length > 0 && (
                <span className="ml-2 text-xs bg-success text-white px-2 py-1 rounded-full">
                  {selectedItems.length} seleccionadas
                </span>
              )}
            </div>
          }
          isDisabled={searchResults.length === 0}
        >
          <div className="flex flex-col gap-4">
            <PriceAnalysisPanel analysis={priceAnalysis} selectedItems={selectedItems} />

            {selectedItems.length > 0 && (
              <>
                <Divider />
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    onPress={() => setExpandedSections(['search', 'analyze', 'confirm'])}
                    className="flex-1"
                  >
                    Continuar a confirmación
                  </Button>
                  <Button
                    variant="flat"
                    onPress={() => setExpandedSections(['search'])}
                  >
                    Volver
                  </Button>
                </div>
              </>
            )}
          </div>
        </AccordionItem>

        {/* Confirmación y Carga */}
        <AccordionItem
          key="confirm"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:check-circle" width={20} />
              <span>Confirmación y Carga</span>
            </div>
          }
          isDisabled={selectedItems.length === 0}
        >
          <div className="flex flex-col gap-4">
            <BulkLoadConfirmation
              items={selectedItems}
              onConfirm={handleConfirm}
              isLoading={isLoading}
              error={error}
            />

            {selectedItems.length > 0 && (
              <Button
                variant="flat"
                onPress={() => setExpandedSections(['search', 'analyze'])}
                isDisabled={isLoading}
              >
                Volver a editar precios
              </Button>
            )}
          </div>
        </AccordionItem>
      </Accordion>

      {/* Summary Card */}
      {(searchResults.length > 0 || selectedItems.length > 0) && (
        <Card className="bg-default-50">
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-default-500 mb-1">Cartas encontradas</p>
                <p className="text-2xl font-bold">{searchResults.length}</p>
              </div>
              <div>
                <p className="text-xs text-default-500 mb-1">Seleccionadas</p>
                <p className="text-2xl font-bold text-primary">{selectedItems.length}</p>
              </div>
              <div>
                <p className="text-xs text-default-500 mb-1">Valor total</p>
                <p className="text-2xl font-bold text-success">
                  ${selectedItems.reduce((sum, item) => sum + item.sellPrice * item.quantity, 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-default-500 mb-1">Estado</p>
                <p className="text-sm font-semibold">
                  {isLoading ? 'Cargando...' : isSearching ? 'Buscando...' : 'Listo'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
