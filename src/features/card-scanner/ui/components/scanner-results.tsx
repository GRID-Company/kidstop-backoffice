import { useEffect } from 'react';
import Image from 'next/image';
import { Button, Chip, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  ICardCandidate,
  IExtractedCardData,
  IScannedCardData,
  TCGGame,
} from '../../domain/types';
import { CardScannerSource } from '@/lib/store/card-scanner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCardSearch } from '../hooks/use-card-search';
import { ScanFieldsEditor } from './scan-fields-editor';
import { ScanOcrText } from './scan-ocr-text';
import { ScanStatusBanner } from './scan-status-banner';

interface ScannerResultsProps {
  scannedData: IScannedCardData;
  game: TCGGame;
  source: CardScannerSource;
  onSave: (updatedData: IExtractedCardData) => void;
  onReset: () => void;
  onUseCandidate: (candidate: ICardCandidate) => void;
}

const USE_CARD_LABELS: Record<CardScannerSource, string> = {
  purchase: 'Usar en compra',
  catalog: 'Ver en catálogo',
  fab: 'Usar esta carta',
};

export const ScannerResults = ({
  scannedData,
  game,
  source,
  onSave,
  onReset,
  onUseCandidate,
}: ScannerResultsProps) => {
  const {
    searchResults,
    isSearching,
    searchError,
    validationErrors,
    searchFeedback,
    canSearch,
    performSearch,
    clearResults,
  } = useCardSearch(game, scannedData);

  useEffect(() => {
    clearResults();
  }, [scannedData, clearResults]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-center'>
        {scannedData.normalizedImageUrl ? (
          <div className='relative h-64 w-45'>
            <Image
              src={scannedData.normalizedImageUrl}
              alt='Carta normalizada'
              fill
              className='rounded-lg object-contain'
              unoptimized
            />
          </div>
        ) : (
          <div className='bg-neutral-subtle flex h-64 w-45 items-center justify-center rounded-lg'>
            <span className='text-content-tertiary text-sm'>Sin imagen</span>
          </div>
        )}
      </div>

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
        <ScanStatusBanner variant='info' title='Criterios de búsqueda'>
          <ul className='space-y-1'>
            {searchFeedback.map((feedback, index) => (
              <li key={index}>{feedback}</li>
            ))}
          </ul>
        </ScanStatusBanner>
      )}

      {validationErrors.length > 0 && (
        <ScanStatusBanner variant='error' title='Errores de validación'>
          <ul className='space-y-1'>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </ScanStatusBanner>
      )}

      {searchError && !validationErrors.length && (
        <ScanStatusBanner variant='warning'>{searchError}</ScanStatusBanner>
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
                <span className='text-content-primary font-medium uppercase'>
                  {searchResults.aiResolved.detectedLanguage}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {searchResults && searchResults.candidates.length > 0 && (
        <div className='border-divider rounded-lg border bg-white p-4'>
          <h4 className='text-content-primary mb-3 text-sm font-semibold'>
            Candidatos encontrados ({searchResults.candidates.length})
          </h4>
          <div className='flex flex-col gap-2'>
            {searchResults.candidates.map((candidate) => (
              <div
                key={`${candidate.guid}-${candidate.isBestMatch}`}
                className='border-divider flex items-center gap-3 rounded-lg border p-3'
              >
                <div className='bg-neutral-subtle relative h-16 w-12 shrink-0 overflow-hidden rounded'>
                  {candidate.imageUrl ? (
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className='h-full w-full object-contain'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center'>
                      <Icon
                        icon='lucide:image-off'
                        width={16}
                        className='text-content-tertiary'
                      />
                    </div>
                  )}
                </div>
                <div className='flex min-w-0 flex-1 flex-col'>
                  <span className='text-content-primary truncate text-sm font-medium'>
                    {candidate.name}
                  </span>
                  <div className='text-content-tertiary flex items-center gap-2 text-xs'>
                    {candidate.setName && (
                      <span className='truncate'>{candidate.setName}</span>
                    )}
                    {candidate.collectorNumber && (
                      <span>#{candidate.collectorNumber}</span>
                    )}
                  </div>
                  <div className='mt-1 flex flex-wrap items-center gap-2'>
                    {candidate.isBestMatch && (
                      <Chip size='sm' variant='flat' color='success'>
                        Mejor coincidencia
                      </Chip>
                    )}
                    {candidate.referencePrice !== null && (
                      <span className='text-content-primary text-xs font-medium'>
                        {formatCurrency(candidate.referencePrice)}
                      </span>
                    )}
                    <span className='text-content-tertiary text-xs'>
                      {candidate.availableStock
                        ? `Stock: ${candidate.totalStock}`
                        : 'Sin stock'}
                    </span>
                  </div>
                </div>
                <Button
                  size='sm'
                  className='bg-accent shrink-0 text-white'
                  onPress={() => onUseCandidate(candidate)}
                >
                  {USE_CARD_LABELS[source]}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='border-divider flex gap-3 border-t pt-4'>
        <Button
          size='lg'
          onPress={performSearch}
          isDisabled={!canSearch || isSearching}
          isLoading={isSearching}
          className='bg-accent flex-1 font-semibold text-white'
          startContent={
            !isSearching && <Icon icon='lucide:search' width={18} />
          }
        >
          {isSearching ? 'Buscando...' : 'Buscar en catálogo'}
        </Button>
        <Button
          variant='flat'
          size='lg'
          onPress={onReset}
          className='text-content-primary font-semibold'
          startContent={<Icon icon='lucide:camera' width={16} />}
        >
          Nueva captura
        </Button>
      </div>
    </div>
  );
};
