'use client';

import { useRef, useState, useEffect } from 'react';
import Script from 'next/script';
import { Select, SelectItem } from '@heroui/react';
import { useCameraStream } from '../hooks/use-camera-stream';
import { useOpenCV } from '../hooks/use-opencv';
import { useCardDetection } from '../hooks/use-card-detection';
import { useCardScannerPipeline } from '../hooks/use-card-scanner-pipeline';
import { CameraPreview } from '../components/camera-preview';
import { CardResult } from '../components/card-result';
import { ExtractedText } from '../components/extracted-text';
import { ScannerControls } from '../components/scanner-controls';
import { ScanResultsView } from '../components/scan-results-view';
import { LoadingState } from '../components/loading-state';
import { TorchControl } from '../components/torch-control';
import { OPENCV_CDN } from '../../domain/constants';
import { TCGGame, IExtractedCardData } from '../../domain/types';
import {
  vibrateSuccess,
  vibrateError,
  checkHapticSupport,
} from '../../domain/haptic-feedback.domain';
import toast from 'react-hot-toast';

export const CardScannerView = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedGame, setSelectedGame] = useState<TCGGame>('pokemon');
  const [autoCapture, setAutoCapture] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [hapticSupported, setHapticSupported] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const stableFramesRef = useRef(0);

  useEffect(() => {
    setIsClient(true);
    const hapticCapabilities = checkHapticSupport();
    setHapticSupported(hapticCapabilities.supported);
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

    if (resultCanvasRef.current) {
      const ctx = resultCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          resultCanvasRef.current.width,
          resultCanvasRef.current.height
        );
      }
    }

    stableFramesRef.current = 0;

    toast.success('Scanner reiniciado');
  };

  const handleSaveEdits = (_updatedData: IExtractedCardData) => {
    if (!scannedData) return;

    toast.success('Datos actualizados correctamente');
  };

  useEffect(() => {
    if (!resultCanvasRef.current) return;

    const canvas = resultCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (
      scannedData &&
      scannedData.normalizedImageUrl &&
      status !== 'results' &&
      status !== 'camera-ready'
    ) {
      const img = new window.Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = scannedData.normalizedImageUrl;
    } else if (status === 'camera-ready') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [scannedData, status]);

  return (
    <>
      <Script
        src={OPENCV_CDN}
        strategy='afterInteractive'
        onLoad={() => {
          console.error('OpenCV.js script cargado desde CDN');
        }}
        onError={(e) => {
          console.error('Error cargando OpenCV.js desde CDN:', e);
          toast.error(
            'Error al cargar OpenCV.js. Verifica tu conexión a internet.'
          );
        }}
      />

      <LoadingState status={status} />

      <div className='min-h-screen bg-gray-900 p-6'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-center text-3xl font-bold text-white'>
            Escáner de Cartas TCG
          </h1>

          {isClient && (
            <div className='mb-6 flex flex-col items-center gap-4'>
              <Select
                label='Selecciona el juego'
                placeholder='Elige Pokémon o Magic'
                selectedKeys={[selectedGame]}
                onChange={(e) => setSelectedGame(e.target.value as TCGGame)}
                className='max-w-xs'
              >
                <SelectItem key='pokemon'>Pokémon TCG</SelectItem>
                <SelectItem key='magic'>Magic: The Gathering</SelectItem>
              </Select>

              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='autoCapture'
                    checked={autoCapture}
                    onChange={(e) => setAutoCapture(e.target.checked)}
                    className='h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='autoCapture'
                    className='cursor-pointer text-sm text-white'
                  >
                    ⚡ Captura automática (recomendado)
                  </label>
                </div>

                {hapticSupported && (
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      id='hapticFeedback'
                      checked={hapticEnabled}
                      onChange={(e) => setHapticEnabled(e.target.checked)}
                      className='h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='hapticFeedback'
                      className='cursor-pointer text-sm text-white'
                    >
                      📳 Vibración al capturar
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {cameraError && (
            <div className='mb-4 rounded-lg bg-red-900/50 p-4 text-red-200'>
              Error de cámara: {cameraError}
            </div>
          )}

          {pipelineError && (
            <div className='mb-4 rounded-lg bg-red-900/50 p-4 text-red-200'>
              Error de procesamiento: {pipelineError}
            </div>
          )}

          {qualityFeedback.length > 0 && (
            <div className='mb-4 rounded-lg bg-blue-900/50 p-4'>
              <strong className='text-blue-200'>Feedback de Calidad:</strong>
              <ul className='mt-2 space-y-1'>
                {qualityFeedback.map((feedback, index) => (
                  <li key={index} className='text-sm text-blue-100'>
                    {feedback}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cvError && (
            <div className='mb-4 rounded-lg bg-red-900/50 p-4 text-red-200'>
              <strong>❌ Error de OpenCV:</strong> {cvError}
              <button
                onClick={() => window.location.reload()}
                className='mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 active:bg-red-800'
              >
                🔄 Recargar Página
              </button>
            </div>
          )}

          {!cvReady && !cvError && (
            <div className='mb-4 rounded-lg bg-yellow-900/50 p-4 text-yellow-200'>
              <div className='flex items-center gap-3'>
                <div className='h-5 w-5 animate-spin rounded-full border-2 border-yellow-200 border-t-transparent'></div>
                <div>
                  <strong>Cargando OpenCV.js...</strong>
                  <p className='mt-1 text-xs'>
                    Esto puede tardar 10-20 segundos en la primera carga
                  </p>
                </div>
              </div>
            </div>
          )}

          {isClient && (
            <div className='mb-4 rounded-lg bg-gray-800 p-4 text-sm text-gray-300'>
              <strong>Debug:</strong>
              <br />
              🎮 Juego: {selectedGame === 'pokemon' ? 'Pokémon' : 'Magic'} | 🔒
              HTTPS: {window.isSecureContext ? '✅' : '❌'} | 📷 Permiso:{' '}
              {permissionState} | OpenCV: {cvReady ? '✅' : '❌'} | Cámara:{' '}
              {isStreaming ? '✅' : '❌'}
              <br />
              Video: {videoRef.current?.videoWidth || 0}x
              {videoRef.current?.videoHeight || 0} | Carta:{' '}
              {cardDetected ? '✅' : '❌'} | Estado: {status}
              {metrics && (
                <>
                  <br />
                  ⏱️ Tiempos: Detección {metrics.contourDetectionMs.toFixed(0)}
                  ms | Perspectiva {metrics.perspectiveTransformMs.toFixed(0)}ms
                  | Regiones {metrics.regionExtractionMs.toFixed(0)}ms | OCR{' '}
                  {metrics.ocrRequestMs.toFixed(0)}ms | Total{' '}
                  {metrics.totalMs.toFixed(0)}ms
                </>
              )}
            </div>
          )}

          {permissionState === 'denied' && (
            <div className='mb-4 rounded-lg bg-red-900/50 p-4 text-sm text-red-200'>
              <strong>⚠️ Permiso de cámara denegado</strong>
              <br />
              Ve a Ajustes → Safari → Cámara y permite el acceso para este
              sitio.
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className='mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 active:bg-red-800'
              >
                🔄 Recargar Página
              </button>
            </div>
          )}

          {permissionState === 'prompt' && !isStreaming && (
            <div className='mb-4'>
              <div className='mb-2 rounded-lg bg-blue-900/50 p-3 text-sm text-blue-200'>
                <strong>📱 Dispositivo iOS detectado</strong>
                <br />
                Toca el botón para solicitar acceso a la cámara
              </div>
              <button
                onClick={() => {
                  console.error('🔴 Botón clickeado');
                  startCamera();
                }}
                className='w-full rounded-lg bg-blue-600 px-4 py-3 text-lg font-semibold text-white hover:bg-blue-700 active:bg-blue-800'
              >
                📷 Activar Cámara
              </button>
            </div>
          )}

          {status === 'results' && scannedData && (
            <ScanResultsView
              scannedData={scannedData}
              game={selectedGame}
              onSave={handleSaveEdits}
              onReset={handleReset}
            />
          )}

          <div
            className={
              status === 'results' && scannedData
                ? 'hidden'
                : 'grid gap-8 lg:grid-cols-2'
            }
          >
            <div className='flex flex-col'>
              <h2 className='mb-4 text-xl font-semibold text-white'>
                Cámara en Vivo
              </h2>
              {isInitializing && !isStreaming && (
                <div className='mb-4 rounded-lg bg-blue-900/50 p-4 text-blue-200'>
                  Iniciando cámara...
                </div>
              )}
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

              {cvReady && debugInfo && (
                <div className='mt-2 rounded bg-black/70 p-2 font-mono text-xs text-white'>
                  {debugInfo}
                </div>
              )}
              <ScannerControls
                onCapture={handleCapture}
                onReset={handleReset}
                disabled={!cvReady || !isStreaming || !latestCorners.current}
                loading={
                  status === 'processing-image' || status === 'extracting-text'
                }
                autoCapture={autoCapture}
              />
            </div>

            <div className='flex flex-col'>
              <h2 className='mb-4 text-xl font-semibold text-white'>
                Carta Escaneada
              </h2>
              <CardResult resultCanvasRef={resultCanvasRef} />
              <ExtractedText
                scannedData={status === 'camera-ready' ? null : scannedData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
