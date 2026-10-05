import { useEffect, useRef, RefObject, useState, useCallback } from 'react';
import { OpenCV, OpenCVMat } from '../../domain/types';
import {
  detectCardContoursWithFallback,
  validateCardAlignment,
} from '../../domain/card-scanner.domain';

export const useCardDetection = (
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  cvReady: boolean,
  cv: OpenCV | null,
  isStreaming: boolean
) => {
  const latestFrameRef = useRef<OpenCVMat | null>(null);
  const latestCornersRef = useRef<number[] | null>(null);
  const lastValidCornersRef = useRef<number[] | null>(null);
  const detectionMethodRef = useRef<'contours' | 'roi-fallback' | 'none'>(
    'none'
  );
  const [cardDetected, setCardDetected] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [resetTrigger, setResetTrigger] = useState(0);
  const mountedRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);
  const stableFramesRef = useRef(0);
  const REQUIRED_STABLE_FRAMES = 2;
  const MAX_STABLE_FRAMES = 8;

  const resetDetection = useCallback(() => {
    if (!mountedRef.current) return;
    setCardDetected(false);
    latestCornersRef.current = null;
    lastValidCornersRef.current = null;
    stableFramesRef.current = 0;
    setResetTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!cvReady || !cv || !isStreaming) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    mountedRef.current = true;
    let active = true;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

    function processVideo() {
      const currentVideo = videoRef.current;
      const currentCanvas = canvasRef.current;

      if (!active || !mountedRef.current || !currentVideo || !currentCanvas)
        return;

      if (!currentVideo.srcObject || currentVideo.readyState < 2) {
        if (active && mountedRef.current) {
          rafIdRef.current = requestAnimationFrame(processVideo);
        }
        return;
      }

      try {
        const currentWidth = currentVideo.videoWidth;
        const currentHeight = currentVideo.videoHeight;

        if (currentWidth === 0 || currentHeight === 0) {
          if (active && mountedRef.current) {
            rafIdRef.current = requestAnimationFrame(processVideo);
          }
          return;
        }

        if (
          currentCanvas.width !== currentWidth ||
          currentCanvas.height !== currentHeight
        ) {
          currentCanvas.width = currentWidth;
          currentCanvas.height = currentHeight;
        }

        if (!tempCtx) {
          if (active && mountedRef.current) {
            rafIdRef.current = requestAnimationFrame(processVideo);
          }
          return;
        }

        tempCanvas.width = currentWidth;
        tempCanvas.height = currentHeight;

        if (!cv) return;

        let src;
        try {
          tempCtx.drawImage(currentVideo, 0, 0, currentWidth, currentHeight);
          const imageData = tempCtx.getImageData(
            0,
            0,
            currentWidth,
            currentHeight
          );
          src = cv.matFromImageData(imageData);

          if (!src || src.empty() || src.cols === 0 || src.rows === 0) {
            console.error('Mat inválido:', {
              empty: src?.empty(),
              cols: src?.cols,
              rows: src?.rows,
            });
            if (src) src.delete();
            if (active && mountedRef.current) {
              rafIdRef.current = requestAnimationFrame(processVideo);
            }
            return;
          }
        } catch (drawError) {
          console.error('Error al capturar frame:', drawError);
          if (src) src.delete();
          if (active && mountedRef.current) {
            rafIdRef.current = requestAnimationFrame(processVideo);
          }
          return;
        }

        if (latestFrameRef.current) {
          latestFrameRef.current.delete();
        }
        latestFrameRef.current = src.clone();

        const { corners, found, method } = detectCardContoursWithFallback(
          src,
          cv
        );

        if (mountedRef.current) {
          setDebugInfo(
            `${currentWidth}x${currentHeight} | Method:${method} | Stable:${stableFramesRef.current}`
          );
        }

        const output = src.clone();

        let cornersToUse = corners;
        let shouldDrawContour = false;

        if (found && corners.length === 8) {
          const alignment = validateCardAlignment(
            corners,
            currentWidth,
            currentHeight,
            undefined,
            0.2
          );
          const isAligned = alignment.aligned;

          if (method === 'contours') {
            if (isAligned) {
              lastValidCornersRef.current = corners;
              stableFramesRef.current = Math.min(
                stableFramesRef.current + 2,
                MAX_STABLE_FRAMES
              );
              shouldDrawContour = true;
              cornersToUse = corners;
            } else {
              stableFramesRef.current = Math.max(
                stableFramesRef.current - 1,
                0
              );
              if (
                stableFramesRef.current >= REQUIRED_STABLE_FRAMES &&
                lastValidCornersRef.current
              ) {
                shouldDrawContour = true;
                cornersToUse = lastValidCornersRef.current;
              }
            }
          } else if (method === 'roi-fallback') {
            stableFramesRef.current = REQUIRED_STABLE_FRAMES;
            shouldDrawContour = true;
            cornersToUse = corners;
            lastValidCornersRef.current = corners;
          }
        } else {
          stableFramesRef.current = Math.max(stableFramesRef.current - 1, 0);
          if (
            stableFramesRef.current >= REQUIRED_STABLE_FRAMES &&
            lastValidCornersRef.current
          ) {
            shouldDrawContour = true;
            cornersToUse = lastValidCornersRef.current;
          }
        }

        if (shouldDrawContour && cornersToUse.length === 8) {
          const isStable = stableFramesRef.current >= REQUIRED_STABLE_FRAMES;

          if (isStable) {
            const contourPoints = cv.matFromArray(
              4,
              1,
              cv.CV_32SC2,
              cornersToUse
            );
            const contours = new cv.MatVector();
            contours.push_back(contourPoints);

            cv.drawContours(
              output,
              contours,
              0,
              new cv.Scalar(0, 255, 0, 255),
              4,
              cv.LINE_8
            );

            contourPoints.delete();
            contours.delete();
          }

          if (isStable) {
            latestCornersRef.current = cornersToUse;
            detectionMethodRef.current = method;
            if (mountedRef.current) {
              setCardDetected(method === 'contours');
            }
          } else {
            latestCornersRef.current = null;
            detectionMethodRef.current = 'none';
            if (mountedRef.current) {
              setCardDetected(false);
            }
          }
        } else {
          latestCornersRef.current = null;
          if (mountedRef.current) {
            setCardDetected(false);
          }
        }

        cv.imshow(currentCanvas, output);

        src.delete();
        output.delete();

        if (active && mountedRef.current) {
          rafIdRef.current = requestAnimationFrame(processVideo);
        }
      } catch (err) {
        console.error('Error en procesamiento de video:', err);
        if (active && mountedRef.current) {
          rafIdRef.current = requestAnimationFrame(processVideo);
        }
      }
    }

    const checkVideoReady = () => {
      if (!active || !mountedRef.current) return;

      const currentVideo = videoRef.current;
      if (
        currentVideo &&
        currentVideo.videoWidth > 0 &&
        currentVideo.videoHeight > 0 &&
        currentVideo.readyState >= 2
      ) {
        rafIdRef.current = requestAnimationFrame(processVideo);
      } else {
        setTimeout(checkVideoReady, 100);
      }
    };

    checkVideoReady();

    return () => {
      active = false;
      mountedRef.current = false;

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (latestFrameRef.current) {
        latestFrameRef.current.delete();
        latestFrameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvReady, cv, isStreaming, resetTrigger]);

  return {
    latestFrame: latestFrameRef,
    latestCorners: latestCornersRef,
    detectionMethod: detectionMethodRef,
    cardDetected,
    resetDetection,
    debugInfo,
  };
};
