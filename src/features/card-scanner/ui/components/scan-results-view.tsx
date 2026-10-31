import { Button, Tabs, Tab, Card, CardBody, Spinner } from '@heroui/react';
import {
  IScannedCardData,
  IExtractedCardData,
  TCGGame,
} from '../../domain/types';
import { ExtractedFieldsEditor } from './extracted-fields-editor';
import { ExtractedText } from './extracted-text';
import { OcrRegionsDebug } from './ocr-regions-debug';
import { useCardSearch } from '../hooks/use-card-search';
import Image from 'next/image';
import { useEffect } from 'react';

interface ScanResultsViewProps {
  scannedData: IScannedCardData;
  game: TCGGame;
  onSave: (updatedData: IExtractedCardData) => void;
  onReset: () => void;
}

export const ScanResultsView = ({
  scannedData,
  game,
  onSave,
  onReset,
}: ScanResultsViewProps) => {
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
    <div className='space-y-4'>
      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='flex flex-col'>
          <h3 className='mb-3 text-lg font-semibold text-white'>
            Carta Normalizada
          </h3>
          <Card className='bg-gray-900'>
            <CardBody className='flex items-center justify-center p-4'>
              {scannedData.normalizedImageUrl ? (
                <div className='relative h-125 w-89.5'>
                  <Image
                    src={scannedData.normalizedImageUrl}
                    alt='Carta normalizada'
                    fill
                    className='rounded-lg object-contain'
                    unoptimized
                  />
                </div>
              ) : (
                <div className='flex h-125 w-89.5 items-center justify-center rounded-lg bg-gray-800'>
                  <span className='text-gray-500'>Sin imagen</span>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className='flex flex-col'>
          <h3 className='mb-3 text-lg font-semibold text-white'>
            Datos Extraídos
          </h3>
          <Tabs aria-label='Opciones de datos' variant='underlined'>
            <Tab key='editor' title='Editor'>
              <ExtractedFieldsEditor
                extractedData={scannedData.extractedData}
                confidence={scannedData.confidence}
                onSave={onSave}
                onCancel={onReset}
              />
            </Tab>
            <Tab key='raw' title='OCR Raw'>
              <ExtractedText scannedData={scannedData} />
            </Tab>
            <Tab key='debug' title='Debug OCR'>
              <OcrRegionsDebug
                regionalOcr={scannedData.rawOcr}
                compositeImageUrl={scannedData.imageDataUrl}
              />
            </Tab>
          </Tabs>
        </div>
      </div>

      {searchFeedback.length > 0 && (
        <Card className='border border-blue-700/50 bg-blue-900/30'>
          <CardBody>
            <h4 className='mb-2 font-semibold text-blue-200'>
              Criterios de Búsqueda
            </h4>
            <ul className='space-y-1'>
              {searchFeedback.map((feedback, index) => (
                <li key={index} className='text-sm text-blue-100'>
                  {feedback}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {validationErrors.length > 0 && (
        <Card className='border border-red-700/50 bg-red-900/30'>
          <CardBody>
            <h4 className='mb-2 font-semibold text-red-200'>
              Errores de Validación
            </h4>
            <ul className='space-y-1'>
              {validationErrors.map((error, index) => (
                <li key={index} className='text-sm text-red-100'>
                  {error}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {searchError && !validationErrors.length && (
        <Card className='border border-yellow-700/50 bg-yellow-900/30'>
          <CardBody>
            <p className='text-sm text-yellow-100'>{searchError}</p>
          </CardBody>
        </Card>
      )}

      {searchResults && (
        <Card className='border border-green-700/50 bg-green-900/30'>
          <CardBody>
            <h4 className='mb-2 font-semibold text-green-200'>
              Resultados de Búsqueda
            </h4>
            <p className='text-sm text-green-100'>
              {searchResults.candidates.length === 0
                ? 'No se encontraron resultados'
                : `Se encontraron ${searchResults.candidates.length} resultado(s)`}
            </p>
            {searchResults.candidates.length > 0 && (
              <div className='mt-3 space-y-2'>
                {searchResults.candidates.map((candidate) => (
                  <div
                    key={candidate.guid}
                    className='rounded bg-green-900/50 p-2 text-sm text-green-50'
                  >
                    <div className='font-medium'>
                      {candidate.name}
                      {candidate.isBestMatch && ' ⭐'}
                    </div>
                    {candidate.setName && (
                      <div className='text-xs text-green-300'>
                        Set: {candidate.setName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      <div className='flex gap-3 border-t border-gray-700 pt-4'>
        <Button
          color='primary'
          size='lg'
          onPress={performSearch}
          isDisabled={!canSearch || isSearching}
          isLoading={isSearching}
          className='flex-1'
        >
          {isSearching ? (
            <>
              <Spinner size='sm' color='white' />
              Buscando...
            </>
          ) : (
            '🔍 Buscar en Catálogo'
          )}
        </Button>
        <Button color='default' variant='flat' size='lg' onPress={onReset}>
          🔄 Nueva Captura
        </Button>
      </div>

      {scannedData.metrics && (
        <Card className='bg-gray-900'>
          <CardBody>
            <h4 className='mb-2 font-semibold text-white'>
              Métricas de Procesamiento
            </h4>
            <div className='grid grid-cols-2 gap-2 text-sm text-gray-300 md:grid-cols-4'>
              <div>
                <span className='text-gray-500'>Detección:</span>{' '}
                <span className='font-medium'>
                  {scannedData.metrics.contourDetectionMs.toFixed(0)}ms
                </span>
              </div>
              <div>
                <span className='text-gray-500'>Perspectiva:</span>{' '}
                <span className='font-medium'>
                  {scannedData.metrics.perspectiveTransformMs.toFixed(0)}ms
                </span>
              </div>
              <div>
                <span className='text-gray-500'>Regiones:</span>{' '}
                <span className='font-medium'>
                  {scannedData.metrics.regionExtractionMs.toFixed(0)}ms
                </span>
              </div>
              <div>
                <span className='text-gray-500'>OCR:</span>{' '}
                <span className='font-medium'>
                  {scannedData.metrics.ocrRequestMs.toFixed(0)}ms
                </span>
              </div>
              <div>
                <span className='text-gray-500'>Parsing:</span>{' '}
                <span className='font-medium'>
                  {scannedData.metrics.parsingMs.toFixed(0)}ms
                </span>
              </div>
              <div>
                <span className='text-gray-500'>Total:</span>{' '}
                <span className='font-medium text-blue-400'>
                  {scannedData.metrics.totalMs.toFixed(0)}ms
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
