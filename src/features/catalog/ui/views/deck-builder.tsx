'use client';

import { useCallback, useState } from 'react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useDeckListImport } from '../hooks/use-deck-list-import';
import { IDeckListResolvedLine } from '../../domain/deck-list-parser.types';
import { ICard } from '../../domain/types';
import { CardPriceFormData } from '../../adapters/forms/card-price.form.schema';
import DeckListImportForm from '../components/deck-list-import-form';
import DeckListImportSummary from '../components/deck-list-import-summary';
import DeckListResultsTable from '../components/deck-list-results-table';
import CardDetailModal from '../components/card-detail-modal';

export default function DeckBuilder() {
  const {
    rawText,
    setRawText,
    importResult,
    hasImported,
    handleImport,
    handleClear,
  } = useDeckListImport();

  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = useCallback((line: IDeckListResolvedLine) => {
    if (line.card) {
      setSelectedCard(line.card);
      setIsDetailOpen(true);
    }
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedCard(null);
  }, []);

  const handleAddToPurchase = useCallback((line: IDeckListResolvedLine) => {
    console.info(`[mock] Add to purchase: ${line.quantity}x ${line.cardName}`);
  }, []);

  const handleSyncProvider = useCallback((cardId: string) => {
    console.info(`[mock] Sync provider for card: ${cardId}`);
  }, []);

  const handleUpdatePrice = useCallback(
    (variantId: string, data: CardPriceFormData) => {
      console.info(`[mock] Update price for variant: ${variantId}`, data);
    },
    []
  );

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Buscador Avanzado">
          <></>
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <div className="flex flex-col gap-6">
            <DeckListImportForm
              rawText={rawText}
              onTextChange={setRawText}
              onImport={handleImport}
              onClear={handleClear}
              hasImported={hasImported}
            />

            {importResult && (
              <>
                <DeckListImportSummary result={importResult} />

                <DeckListResultsTable
                  lines={importResult.lines}
                  onAddToPurchase={handleAddToPurchase}
                  onViewDetail={handleViewDetail}
                />
              </>
            )}
          </div>
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <CardDetailModal
        card={selectedCard}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onSyncProvider={handleSyncProvider}
        onUpdatePrice={handleUpdatePrice}
      />
    </>
  );
}
