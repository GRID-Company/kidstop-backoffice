import { useEffect } from 'react';
import { Button, Chip, Skeleton, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  ICardCandidate,
  IExtractedCardData,
  IScannedCardData,
  TCGGame,
} from '../../domain/types';
import { CardScannerSource } from '@/lib/store/card-scanner';
import { CardScanEffort } from '@/lib/api/schema-types';
import { ISO_LANGUAGE_LABELS } from '@/lib/types/language.types';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { CardImage } from '@/shared/components/card-image';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { BulkCardResultSummary } from '@/shared/blocks/bulk-card-search';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { IPurchaseItem } from '@/features/purchases/domain/types';
import PurchaseCardResultItem from '@/features/purchases/ui/components/purchase-card-result-item';
import { mapScanCandidateToCardSearchResult } from '@/features/purchases/adapters/mappers/scan-candidate-to-card-search-result.mapper';
import { mapScanCandidateToBulkCard } from '../../adapters/mappers/scan-candidate-to-bulk-card.mapper';
import { useCardSearch } from '../hooks/use-card-search';
import { ScanEmptyState } from './scan-empty-state';
import { ScanFieldsEditor } from './scan-fields-editor';
import { ScanOcrText } from './scan-ocr-text';
import { ScanStatusBanner } from './scan-status-banner';

interface ScannerResultsProps {
  scannedData: IScannedCardData;
  game: TCGGame;
  source: CardScannerSource;
  effort: CardScanEffort;
  onSave: (updatedData: IExtractedCardData) => void;
  onReset: () => void;
  onUseCandidate: (candidate: ICardCandidate) => void;
  onAddPurchaseItem: (item: IPurchaseItem) => void;
  existingItemIds: Set<string>;
}

const USE_CARD_LABELS: Partial<Record<CardScannerSource, string>> = {
  catalog: 'Ver en catálogo',
  fab: 'Ver detalle',
};

export const ScannerResults = ({
  scannedData,
  game,
  source,
  effort,
  onSave,
  onReset,
  onUseCandidate,
  onAddPurchaseItem,
  existingItemIds,
}: ScannerResultsProps) => {
  const {
    searchResults,
    isSearching,
    searchError,
    validationErrors,
    searchFeedback,
    performSearch,
  } = useCardSearch(game, scannedData, effort);

  const tcgType = game === 'pokemon' ? TCG_TYPES.POKEMON : TCG_TYPES.MAGIC;
  const {
    isOpen: isImagePreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const hasCandidates = !!searchResults && searchResults.candidates.length > 0;
  const hasAiResolved = !!searchResults?.aiResolved;
  const hasAnyResult = hasCandidates || hasAiResolved;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-center'>
        {scannedData.normalizedImageUrl ? (
          <CardImage
            src={scannedData.normalizedImageUrl}
            alt='Carta escaneada'
            tcgType={tcgType}
            containerClassName='relative h-64 w-45'
            className='rounded-lg object-contain'
            enablePreview
            onImageClick={() =>
              openPreview(
                scannedData.normalizedImageUrl,
                'Carta escaneada',
                tcgType
              )
            }
          />
        ) : (
          <div className='bg-neutral-subtle flex h-64 w-45 items-center justify-center rounded-lg'>
            <span className='text-content-tertiary text-sm'>Sin imagen</span>
          </div>
        )}
      </div>

      {isSearching && (
        <div className='border-divider rounded-lg border bg-white p-4'>
          <div className='mb-3 flex items-center gap-2'>
            <Icon
              icon='lucide:loader-circle'
              className='text-accent animate-spin'
              width={16}
            />
            <span className='text-content-primary text-sm font-medium'>
              Buscando en el catálogo…
            </span>
          </div>
          <div className='flex flex-col gap-2'>
            {[0, 1, 2].map((row) => (
              <div key={row} className='flex items-center gap-3'>
                <Skeleton className='h-[90px] w-[65px] shrink-0 rounded-md' />
                <div className='flex flex-1 flex-col gap-2'>
                  <Skeleton className='h-3 w-3/5 rounded' />
                  <Skeleton className='h-3 w-2/5 rounded' />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isSearching &&
        (searchError || validationErrors.length > 0) &&
        !hasAnyResult &&
        (validationErrors.length > 0 ||
        searchError === 'No se encontraron resultados' ? (
          <ScanEmptyState
            title='No encontramos esta carta'
            tips={[
              'Pokémon: usa fondo oscuro · Magic: usa fondo claro',
              'Evita reflejos y luz directa sobre la carta',
              'Acércate hasta que la carta llene el recuadro',
              'Limpia el lente de la cámara',
            ]}
            onRescan={onReset}
          />
        ) : (
          <ScanEmptyState
            title='No pudimos buscar en el catálogo'
            message={searchError ?? undefined}
            onRescan={onReset}
            onRetry={performSearch}
          />
        ))}

      {!isSearching && searchError && hasAnyResult && (
        <ScanStatusBanner variant='warning'>{searchError}</ScanStatusBanner>
      )}

      {hasCandidates && source === 'purchase' && (
        <div className='border-divider rounded-lg border bg-white p-4'>
          <h4 className='text-content-primary mb-3 text-sm font-semibold'>
            Coincidencias ({searchResults.candidates.length})
          </h4>
          <div className='flex flex-col gap-2'>
            {searchResults.candidates.map((candidate) => (
              <PurchaseCardResultItem
                key={`${candidate.guid}-${candidate.isBestMatch}`}
                card={mapScanCandidateToCardSearchResult(candidate)}
                onAdd={onAddPurchaseItem}
                existingItemIds={existingItemIds}
                isBestMatch={candidate.isBestMatch}
                stacked
              />
            ))}
          </div>
        </div>
      )}

      {hasCandidates && source !== 'purchase' && (
        <div className='border-divider rounded-lg border bg-white p-4'>
          <h4 className='text-content-primary mb-3 text-sm font-semibold'>
            Coincidencias ({searchResults.candidates.length})
          </h4>
          <div className='flex flex-col gap-2'>
            {searchResults.candidates.map((candidate) => (
              <KidstopCard
                key={`${candidate.guid}-${candidate.isBestMatch}`}
                className='w-full'
              >
                <div className='flex items-center gap-3 p-3'>
                  <BulkCardResultSummary
                    card={mapScanCandidateToBulkCard(candidate)}
                    tcgType={tcgType}
                  />
                  <div className='flex shrink-0 flex-col items-end gap-2'>
                    {candidate.isBestMatch && (
                      <Chip size='sm' variant='flat' color='success'>
                        Mejor coincidencia
                      </Chip>
                    )}
                    <Button
                      size='sm'
                      className='bg-accent text-white'
                      onPress={() => onUseCandidate(candidate)}
                    >
                      {USE_CARD_LABELS[source]}
                    </Button>
                  </div>
                </div>
              </KidstopCard>
            ))}
          </div>
        </div>
      )}

      {searchResults?.aiResolved && (
        <div className='border-divider rounded-lg border bg-white p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <h4 className='text-content-primary text-sm font-semibold'>
              Interpretación
            </h4>
            {searchResults.resolvedByAI && (
              <Chip
                size='sm'
                variant='flat'
                color='secondary'
                startContent={<Icon icon='lucide:sparkles' width={12} />}
              >
                Resuelto por IA
              </Chip>
            )}
          </div>
          <div className='flex flex-col gap-1 text-sm'>
            {(searchResults.aiResolved.nameEs ||
              searchResults.aiResolved.name) && (
              <div className='flex justify-between gap-2'>
                <span className='text-content-tertiary'>Nombre</span>
                <span className='text-content-primary text-right font-medium'>
                  {searchResults.aiResolved.nameEs ??
                    searchResults.aiResolved.name}
                  {searchResults.aiResolved.nameEs &&
                    searchResults.aiResolved.name &&
                    searchResults.aiResolved.nameEs !==
                      searchResults.aiResolved.name &&
                    ` (${searchResults.aiResolved.name})`}
                </span>
              </div>
            )}
            {(searchResults.aiResolved.setNameEs ||
              searchResults.aiResolved.setName) && (
              <div className='flex justify-between gap-2'>
                <span className='text-content-tertiary'>Set</span>
                <span className='text-content-primary text-right font-medium'>
                  {searchResults.aiResolved.setNameEs ??
                    searchResults.aiResolved.setName}
                  {searchResults.aiResolved.setCode &&
                    ` (${searchResults.aiResolved.setCode})`}
                </span>
              </div>
            )}
            {searchResults.aiResolved.cardNumber && (
              <div className='flex justify-between'>
                <span className='text-content-tertiary'>Número</span>
                <span className='text-content-primary font-medium'>
                  #{searchResults.aiResolved.cardNumber}
                </span>
              </div>
            )}
            {searchResults.aiResolved.detectedLanguage && (
              <div className='flex justify-between'>
                <span className='text-content-tertiary'>Idioma detectado</span>
                <span className='text-content-primary font-medium'>
                  {ISO_LANGUAGE_LABELS[
                    searchResults.aiResolved.detectedLanguage.toLowerCase()
                  ] ?? searchResults.aiResolved.detectedLanguage.toUpperCase()}
                </span>
              </div>
            )}
            {(searchResults.aiResolved.cardTextEs ||
              searchResults.aiResolved.cardText) && (
              <div className='flex justify-between gap-2'>
                <span className='text-content-tertiary shrink-0'>Texto</span>
                <span className='text-content-primary line-clamp-3 text-right font-medium'>
                  {searchResults.aiResolved.cardTextEs ??
                    searchResults.aiResolved.cardText}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className='border-divider rounded-lg border border-dashed p-3'>
        <p className='text-content-tertiary mb-2 text-xs font-semibold tracking-wide uppercase'>
          Debug
        </p>
        <Tabs aria-label='Datos del escaneo' variant='underlined' size='sm'>
          <Tab key='editor' title='Datos extraídos'>
            <ScanFieldsEditor
              extractedData={scannedData.extractedData}
              confidence={scannedData.confidence}
              onSave={onSave}
              onCancel={onReset}
            />
          </Tab>
          <Tab key='raw' title='OCR'>
            <ScanOcrText scannedData={scannedData} />
          </Tab>
        </Tabs>

        {searchFeedback.length > 0 && (
          <div className='mt-3'>
            <ScanStatusBanner variant='info' title='Criterios de búsqueda'>
              <ul className='space-y-1'>
                {searchFeedback.map((feedback, index) => (
                  <li key={index}>{feedback}</li>
                ))}
              </ul>
            </ScanStatusBanner>
          </div>
        )}
      </div>

      <div className='border-divider flex gap-3 border-t pt-4'>
        <Button
          variant='flat'
          size='lg'
          onPress={onReset}
          className='text-content-primary flex-1 font-semibold'
          startContent={<Icon icon='lucide:camera' width={16} />}
        >
          Nueva captura
        </Button>
      </div>

      <CardImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />
    </div>
  );
};
