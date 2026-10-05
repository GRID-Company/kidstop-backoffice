'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

import { useCameraStream } from '../hooks/use-camera-stream';
import { useOpenCV } from '../hooks/use-opencv';
import { useCardDetection } from '../hooks/use-card-detection';
import { useCardScannerPipeline } from '../hooks/use-card-scanner-pipeline';
import { CameraPreview } from './camera-preview';
import { TorchControl } from './torch-control';
import { ScannerActionBar } from './scanner-action-bar';
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
import { TCG_OPTIONS } from '@/lib/consts/tcg-options';

interface ScannerPanelProps {
  source: CardScannerSource;
}

export const ScannerPanel = ({ source }: ScannerPanelProps) => {
  const router = useRouter();
  const closeScanner = useCardScannerStore((state) => state.closeScanner);
  const confirmCandidate = useCardScannerStore(
    (state) => state.confirmCandidate
  );
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const selectedGame: TCGGame =
    selectedTCG === TCG_TYPES.POKEMON ? 'pokemon' : 'magic';
  const tcgOption = TCG_OPTIONS.find((option) => option.key === selectedTCG);

  const [autoCapture, setAutoCapture] = useState(true);
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
    latestFrame,
    latestCorners,
    detectionMethod,
    cardDetected,
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
    updateExtractedData,
    reset: resetPipeline,
  } = useCardScannerPipeline(selectedGame);

  useEffect(() => {
    if (
      autoCapture &&
      cardDetected &&
      status === 'camera-ready' &&
      !scannedData
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
  }, [cardDetected, autoCapture, status, scannedData]);

  const handleCapture = async () => {
    if (!latestFrame.current || !latestCorners.current || !cv) {
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
      const frameSize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };

      await processCard(
        latestFrame.current,
        latestCorners.current,
        cv,
        frameSize
      );

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

    confirmCandidate(candidate);
    toast.success(`"${candidate.name}" seleccionada`);
    closeScanner();
  };

  const isProcessing =
    status === 'capturing' ||
    status === 'processing-image' ||
    status === 'extracting-text' ||
    status === 'searching';

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
        <div className='flex items-center justify-between'>
          <Chip
            size='sm'
            variant='flat'
            className='text-content-primary'
            startContent={
              tcgOption && (
                <Icon icon={tcgOption.icon} className='text-accent text-sm' />
              )
            }
          >
            {tcgOption?.label ?? selectedTCG}
          </Chip>
          <span className='text-content-tertiary text-xs'>
            {source === 'purchase'
              ? 'Escanear para compra'
              : 'Escáner de cartas'}
          </span>
        </div>

        {!cvReady && !cvError && (
          <ScanStatusBanner variant='info' title='Cargando OpenCV.js...'>
            Esto puede tardar 10-20 segundos en la primera carga.
          </ScanStatusBanner>
        )}

        {cvError && (
          <ScanStatusBanner
            variant='error'
            title='Error de OpenCV'
            action={
              <Button
                size='sm'
                variant='flat'
                color='danger'
                onPress={() => window.location.reload()}
              >
                Recargar
              </Button>
            }
          >
            {cvError}
          </ScanStatusBanner>
        )}

        {cameraError && (
          <ScanStatusBanner variant='error' title='Error de cámara'>
            {cameraError}
          </ScanStatusBanner>
        )}

        {pipelineError && (
          <ScanStatusBanner variant='error' title='Error de procesamiento'>
            {pipelineError}
          </ScanStatusBanner>
        )}

        {qualityFeedback.length > 0 && (
          <ScanStatusBanner variant='info' title='Feedback de calidad'>
            <ul className='space-y-1'>
              {qualityFeedback.map((feedback, index) => (
                <li key={index}>{feedback}</li>
              ))}
            </ul>
          </ScanStatusBanner>
        )}

        {permissionState === 'denied' && (
          <ScanStatusBanner
            variant='error'
            title='Permiso de cámara denegado'
            action={
              <Button
                size='sm'
                variant='flat'
                color='danger'
                onPress={() => window.location.reload()}
              >
                Recargar
              </Button>
            }
          >
            Permite el acceso a la cámara en la configuración del navegador para
            este sitio.
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

        {isInitializing && !isStreaming && (
          <ScanStatusBanner variant='info'>
            Iniciando cámara...
          </ScanStatusBanner>
        )}

        {status === 'results' && scannedData && (
          <ScannerResults
            scannedData={scannedData}
            game={selectedGame}
            source={source}
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
            showGrid={true}
            torchControl={
              <TorchControl
                supported={torchSupported}
                enabled={torchEnabled}
                onToggle={toggleTorch}
                disabled={!isStreaming}
              />
            }
          />
          <ScannerActionBar
            status={status}
            autoCapture={autoCapture}
            onAutoCaptureChange={setAutoCapture}
            onCapture={handleCapture}
            onReset={handleReset}
            disabled={!cvReady || !isStreaming || !latestCorners.current}
          />
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
