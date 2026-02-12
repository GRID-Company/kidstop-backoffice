import { useState, useCallback, useMemo } from 'react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { MOCK_CARDS } from '../../adapters/api/catalog.mock';
import {
  parseDeckListText,
  resolveCardsFromCatalog,
  buildImportResult,
} from '../../domain/deck-list-parser';
import { IDeckListImportResult } from '../../domain/deck-list-parser.types';

export function useDeckListImport() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const [rawText, setRawText] = useState('');
  const [importResult, setImportResult] = useState<IDeckListImportResult | null>(null);
  const [hasImported, setHasImported] = useState(false);

  const catalogCards = useMemo(
    () => MOCK_CARDS.filter((c) => c.tcgType === selectedTCG),
    [selectedTCG]
  );

  const handleImport = useCallback(() => {
    const parsed = parseDeckListText(rawText);

    if (parsed.length === 0) {
      setImportResult(null);
      setHasImported(false);
      return;
    }

    const resolved = resolveCardsFromCatalog(parsed, catalogCards);
    const result = buildImportResult(resolved);
    setImportResult(result);
    setHasImported(true);
  }, [rawText, catalogCards]);

  const handleClear = useCallback(() => {
    setRawText('');
    setImportResult(null);
    setHasImported(false);
  }, []);

  const handleTextChange = useCallback((value: string) => {
    setRawText(value);
    setHasImported(false);
    setImportResult(null);
  }, []);

  return {
    rawText,
    setRawText: handleTextChange,
    importResult,
    hasImported,
    handleImport,
    handleClear,
    selectedTCG,
  };
}
