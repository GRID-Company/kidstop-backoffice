'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

import { useCameraStream } from '../hooks/use-camera-stream';
import { useOpenCV } from '../hooks/use-opencv';
import { getFriendlyPipelineError } from '../../domain/card-scanner.domain';
import { useCardDetection } from '../hooks/use-card-detection';
import { useCardScannerPipeline } from '../hooks/use-card-scanner-pipeline';
import { CameraPreview } from './camera-preview';
import { TorchControl } from './torch-control';
import { ScannerModeToggles } from './scanner-mode-toggles';
import { ScannerCaptureButton } from './scanner-capture-button';
import { ScannerResults } from './scanner-results';
import { ScanStatusBanner } from './scan-status-banner';
import { OPENCV_CDN } from '../../domain/constants';
import {
  ICardCandidate,
  IExtractedCardData,
  TCGGame,
} from '../../domain/types';
import {
  vibrateSuccess,
  vibrateError,
  checkHapticSupport,
} from '../../domain/haptic-feedback.domain';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import {
  useCardScannerStore,
  CardScannerSource,
} from '@/lib/store/card-scanner';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';

interface ScannerPanelProps {
  source: CardScannerSource;
  onOpenCardDetail: (candidate: ICardCandidate) => void;
}

export const ScannerPanel = ({
  source,
  onOpenCardDetail,
}: ScannerPanelProps) => {
  const router = useRouter();
  const closeScanner = useCardScannerStore((state) => state.closeScanner);
  const confirmCandidate = useCardScannerStore(
    (state) => state.confirmCandidate
  );
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const selectedGame: TCGGame =
    selectedTCG === TCG_TYPES.POKEMON ? 'pokemon' : 'magic';

  const [autoCapture, setAutoCapture] = useState(false);
  const [aiSearchOnly, setAiSearchOnly] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stableFramesRef = useRef(0);

  useEffect(() => {
    setHapticEnabled(checkHapticSupport().supported);
  }, []);

  const { cvReady, cv, error: cvError } = useOpenCV();
  const {
    isStreaming,
    error: cameraError,
    permissionState,
    startCamera,
    isInitializing,
    torchSupported,
    torchEnabled,
    toggleTorch,
  } = useCameraStream(videoRef);
  const {
    bestFrame,
    latestCorners,
    detectionMethod,
    cardDetected,
    captureFlags,
    resetDetection,
    debugInfo,
  } = useCardDetection(videoRef, canvasRef, cvReady, cv, isStreaming);
  const {
    status,
    scannedData,
    metrics,
    error: pipelineError,
    qualityFeedback,
    processCard,
    processRawCapture,
    updateExtractedData,
    reset: resetPipeline,
  } = useCardScannerPipeline(selectedGame);

  useEffect(() => {
    if (
      autoCapture &&
      !aiSearchOnly &&
      cardDetected &&
      status === 'camera-ready' &&
      !scannedData &&
      !captureFlags.glare &&
      !captureFlags.dark &&
      !captureFlags.tooSmall
    ) {
      stableFramesRef.current += 1;

      if (stableFramesRef.current >= 1) {
        stableFramesRef.current = 0;
        handleCapture();
      }
    } else {
      stableFramesRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDetected, autoCapture, status, scannedData, captureFlags]);

  const handleAiSearchOnlyChange = (enabled: boolean) => {
    setAiSearchOnly(enabled);
    if (enabled) {
      setAutoCapture(false);
    }
  };

  const handleCapture = async () => {
    if (aiSearchOnly) {
      if (!videoRef.current) {
        toast.error('Video no disponible');
        if (hapticEnabled) {
          vibrateError();
        }
        return;
      }

      try {
        await processRawCapture(videoRef.current);

        if (hapticEnabled) {
          vibrateSuccess();
        }

        toast.success('Imagen capturada exitosamente');
      } catch (err) {
        console.error('Error al capturar imagen:', err);
        toast.error('Error al procesar la imagen');
        if (hapticEnabled) {
          vibrateError();
        }
      }
      return;
    }

    if (!bestFrame.current || !latestCorners.current || !cv) {
      toast.error('No se detecta ninguna carta en el recuadro');
      if (hapticEnabled) {
        vibrateError();
      }
      return;
    }

    if (detectionMethod.current === 'roi-fallback') {
      toast.error(
        'Por favor alinea la carta con la guía o usa un fondo contrastante'
      );
      if (hapticEnabled) {
        vibrateError();
      }
      return;
    }

    if (!videoRef.current) {
      toast.error('Video no disponible');
      if (hapticEnabled) {
        vibrateError();
      }
      return;
    }

    try {
      await processCard(bestFrame.current.mat, bestFrame.current.corners, cv, {
        width: bestFrame.current.width,
        height: bestFrame.current.height,
      });

      if (hapticEnabled) {
        vibrateSuccess();
      }

      if (!autoCapture) {
        toast.success('Carta capturada exitosamente');
      }
    } catch (err) {
      console.error('Error al capturar carta:', err);
      toast.error('Error al procesar la carta');
      if (hapticEnabled) {
        vibrateError();
      }
    }
  };

  const handleReset = () => {
    resetPipeline();
    resetDetection();
    stableFramesRef.current = 0;
    toast.success('Escáner reiniciado');
  };

  const handleSaveEdits = (updatedData: IExtractedCardData) => {
    if (!scannedData) return;

    updateExtractedData(updatedData);
    toast.success('Datos actualizados correctamente');
  };

  const handleUseCandidate = (candidate: ICardCandidate) => {
    if (source === 'catalog') {
      closeScanner();
      router.push('/catalogo');
      return;
    }

    if (source === 'fab') {
      onOpenCardDetail(candidate);
      return;
    }

    confirmCandidate(candidate);
    toast.success(`"${candidate.name}" seleccionada`);
    closeScanner();
  };

  const isProcessing =
    status === 'capturing' ||
    status === 'processing-image' ||
    status === 'extracting-text' ||
    status === 'searching';

  const reloadAction = (
    <Button
      size='sm'
      variant='flat'
      color='danger'
      onPress={() => window.location.reload()}
    >
      Recargar
    </Button>
  );

  const statusBanner =
    permissionState === 'denied'
      ? {
          variant: 'error' as const,
          title: 'Permiso de cámara denegado',
          message:
            'Permite el acceso a la cámara en la configuración del navegador para este sitio.',
          action: reloadAction,
        }
      : cameraError
        ? {
            variant: 'error' as const,
            title: 'Error de cámara',
            message: cameraError,
          }
        : cvError
          ? {
              variant: 'error' as const,
              title: 'Error de OpenCV',
              message: cvError,
              action: reloadAction,
            }
          : !cvReady
            ? {
                variant: 'info' as const,
                title: 'Cargando OpenCV.js…',
                message:
                  'Esto puede tardar 10-20 segundos en la primera carga.',
              }
            : isInitializing && !isStreaming
              ? {
                  variant: 'info' as const,
                  message: 'Iniciando cámara…',
                }
              : pipelineError
                ? {
                    variant: 'error' as const,
                    title: 'Error de procesamiento',
                    message: getFriendlyPipelineError(pipelineError),
                  }
                : status === 'camera-ready' &&
                    (captureFlags.glare ||
                      captureFlags.dark ||
                      captureFlags.tooSmall)
                  ? {
                      variant: 'warning' as const,
                      message: captureFlags.glare
                        ? 'Hay reflejos sobre la carta. Inclínala un poco para evitarlos.'
                        : captureFlags.dark
                          ? 'Está muy oscuro. Busca mejor iluminación.'
                          : 'La carta está muy lejos. Acércala a la guía.',
                    }
                  : null;

  return (
    <>
      <Script
        src={OPENCV_CDN}
        strategy='afterInteractive'
        onError={(e) => {
          console.error('Error cargando OpenCV.js desde CDN:', e);
          toast.error(
            'Error al cargar OpenCV.js. Verifica tu conexión a internet.'
          );
        }}
      />

      <div className='flex flex-col gap-4'>
        <TcgSegmentedSelector />

        {statusBanner && (
          <ScanStatusBanner
            variant={statusBanner.variant}
            title={statusBanner.title}
            action={statusBanner.action}
          >
            {statusBanner.message}
          </ScanStatusBanner>
        )}

        {permissionState === 'prompt' && !isStreaming && !cameraError && (
          <Button
            size='lg'
            className='bg-accent w-full font-semibold text-white'
            onPress={startCamera}
            startContent={<Icon icon='lucide:camera' width={18} />}
          >
            Activar cámara
          </Button>
        )}

        {process.env.NODE_ENV === 'development' &&
          qualityFeedback.length > 0 && (
            <ScanStatusBanner variant='info' title='Feedback de calidad'>
              <ul className='space-y-1'>
                {qualityFeedback.map((feedback, index) => (
                  <li key={index}>{feedback}</li>
                ))}
              </ul>
            </ScanStatusBanner>
          )}

        {status === 'results' && scannedData && (
          <ScannerResults
            scannedData={scannedData}
            game={selectedGame}
            source={source}
            aiSearchOnly={aiSearchOnly}
            onSave={handleSaveEdits}
            onReset={handleReset}
            onUseCandidate={handleUseCandidate}
          />
        )}

        <div
          className={
            status === 'results' && scannedData ? 'hidden' : 'contents'
          }
        >
          <CameraPreview
            videoRef={videoRef}
            canvasRef={canvasRef}
            cvReady={cvReady}
            cardDetected={cardDetected}
            toggleControls={
              <ScannerModeToggles
                autoCapture={autoCapture}
                onAutoCaptureChange={setAutoCapture}
                aiSearchOnly={aiSearchOnly}
                onAiSearchOnlyChange={handleAiSearchOnlyChange}
                disabled={isProcessing}
              />
            }
            torchControl={
              <TorchControl
                supported={torchSupported}
                enabled={torchEnabled}
                onToggle={toggleTorch}
                disabled={!isStreaming}
              />
            }
            captureControl={
              <ScannerCaptureButton
                onCapture={handleCapture}
                loading={isProcessing}
                disabled={
                  aiSearchOnly
                    ? !isStreaming
                    : !cvReady || !isStreaming || !latestCorners.current
                }
              />
            }
          />
          <div className='flex justify-end'>
            <Button
              variant='flat'
              onPress={handleReset}
              isDisabled={isProcessing}
              className='text-content-primary font-semibold'
              startContent={<Icon icon='lucide:rotate-ccw' width={16} />}
              aria-label='Reiniciar escáner y limpiar captura'
            >
              Reiniciar
            </Button>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' &&
          cvReady &&
          (debugInfo || isProcessing || metrics) && (
            <div className='bg-neutral-subtle rounded p-2 font-mono text-xs'>
              {debugInfo && <div>{debugInfo}</div>}
              <div>
                Estado: {status} | Carta: {cardDetected ? 'sí' : 'no'}
              </div>
              {metrics && (
                <div>
                  Det {metrics.contourDetectionMs.toFixed(0)}ms · Persp{' '}
                  {metrics.perspectiveTransformMs.toFixed(0)}ms · Reg{' '}
                  {metrics.regionExtractionMs.toFixed(0)}ms · OCR{' '}
                  {metrics.ocrRequestMs.toFixed(0)}ms · Total{' '}
                  {metrics.totalMs.toFixed(0)}ms
                </div>
              )}
            </div>
          )}
      </div>
    </>
  );
};
