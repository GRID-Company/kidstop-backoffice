import { useEffect, useRef, RefObject, useState, useCallback } from 'react';
import {
  OpenCV,
  OpenCVMat,
  IBufferedFrame,
  ICaptureFlags,
} from '../../domain/types';
import {
  detectCardContoursWithFallback,
  validateCardAlignment,
  getROIFromGuide,
} from '../../domain/card-scanner.domain';
import {
  calculateSharpness,
  calculateGlareRatio,
  calculateBrightness,
} from '../../domain/normalization.domain';
import {
  DETECTION_MAX_WIDTH,
  FRAME_BUFFER_SIZE,
  MOTION_MAE_THRESHOLD,
  MOTION_SAMPLE_WIDTH,
} from '../../domain/constants';

export const useCardDetection = (
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  cvReady: boolean,
  cv: OpenCV | null,
  isStreaming: boolean
) => {
  const frameBufferRef = useRef<IBufferedFrame[]>([]);
  const bestFrameRef = useRef<IBufferedFrame | null>(null);
  const latestCornersRef = useRef<number[] | null>(null);
  const lastValidCornersRef = useRef<number[] | null>(null);
  const detectionMethodRef = useRef<'contours' | 'roi-fallback' | 'none'>(
    'none'
  );
  const [cardDetected, setCardDetected] = useState(false);
  const [captureFlags, setCaptureFlags] = useState<ICaptureFlags>({
    glare: false,
    dark: false,
    tooSmall: false,
  });
  const flagFramesRef = useRef({ glare: 0, dark: 0, tooSmall: 0 });
  const prevMotionMatRef = useRef<OpenCVMat | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [resetTrigger, setResetTrigger] = useState(0);
  const mountedRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);
  const stableFramesRef = useRef(0);
  const REQUIRED_STABLE_FRAMES = 2;
  const MAX_STABLE_FRAMES = 8;
  const REQUIRED_FLAG_FRAMES = 10;

  const clearFrameBuffer = useCallback(() => {
    for (const entry of frameBufferRef.current) {
      entry.mat.delete();
    }
    frameBufferRef.current = [];
    bestFrameRef.current = null;
  }, []);

  const resetDetection = useCallback(() => {
    if (!mountedRef.current) return;
    setCardDetected(false);
    latestCornersRef.current = null;
    lastValidCornersRef.current = null;
    stableFramesRef.current = 0;
    flagFramesRef.current = { glare: 0, dark: 0, tooSmall: 0 };
    setCaptureFlags({ glare: false, dark: false, tooSmall: false });
    clearFrameBuffer();
    setResetTrigger((prev) => prev + 1);
  }, [clearFrameBuffer]);

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
    const captureCanvas = document.createElement('canvas');
    const captureCtx = captureCanvas.getContext('2d', {
      willReadFrequently: true,
    });
    const displayCtx = canvas.getContext('2d');

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

        if (!cv) return;

        const detectionScale = Math.min(1, DETECTION_MAX_WIDTH / currentWidth);
        const detectW = Math.round(currentWidth * detectionScale);
        const detectH = Math.round(currentHeight * detectionScale);

        let detectMat;
        try {
          tempCanvas.width = detectW;
          tempCanvas.height = detectH;
          tempCtx.drawImage(currentVideo, 0, 0, detectW, detectH);
          const imageData = tempCtx.getImageData(0, 0, detectW, detectH);
          detectMat = cv.matFromImageData(imageData);

          if (
            !detectMat ||
            detectMat.empty() ||
            detectMat.cols === 0 ||
            detectMat.rows === 0
          ) {
            console.error('Mat inválido:', {
              empty: detectMat?.empty(),
              cols: detectMat?.cols,
              rows: detectMat?.rows,
            });
            if (detectMat) detectMat.delete();
            if (active && mountedRef.current) {
              rafIdRef.current = requestAnimationFrame(processVideo);
            }
            return;
          }
        } catch (drawError) {
          console.error('Error al capturar frame:', drawError);
          if (detectMat) detectMat.delete();
          if (active && mountedRef.current) {
            rafIdRef.current = requestAnimationFrame(processVideo);
          }
          return;
        }

        if (displayCtx) {
          displayCtx.drawImage(currentVideo, 0, 0, currentWidth, currentHeight);
        }

        const motionGray = new cv.Mat();
        const motionSmall = new cv.Mat();
        cv.cvtColor(detectMat, motionGray, cv.COLOR_RGBA2GRAY);
        const motionH = Math.max(
          1,
          Math.round(detectH * (MOTION_SAMPLE_WIDTH / detectW))
        );
        cv.resize(
          motionGray,
          motionSmall,
          new cv.Size(MOTION_SAMPLE_WIDTH, motionH),
          0,
          0,
          cv.INTER_LINEAR
        );
        motionGray.delete();

        let isMoving = false;
        const prevMotion = prevMotionMatRef.current;
        if (
          prevMotion &&
          !prevMotion.isDeleted() &&
          prevMotion.cols === motionSmall.cols &&
          prevMotion.rows === motionSmall.rows
        ) {
          const motionDiff = new cv.Mat();
          cv.absdiff(motionSmall, prevMotion, motionDiff);
          const motionMean = cv.mean(motionDiff);
          motionDiff.delete();
          isMoving = (motionMean[0] ?? 0) > MOTION_MAE_THRESHOLD;
        }
        if (prevMotion && !prevMotion.isDeleted()) {
          prevMotion.delete();
        }
        prevMotionMatRef.current = motionSmall;

        if (isMoving) {
          if (
            stableFramesRef.current >= REQUIRED_STABLE_FRAMES &&
            lastValidCornersRef.current &&
            displayCtx
          ) {
            const held = lastValidCornersRef.current;
            displayCtx.strokeStyle = 'rgba(34, 197, 94, 0.95)';
            displayCtx.lineWidth = 4;
            displayCtx.beginPath();
            displayCtx.moveTo(held[0], held[1]);
            for (let i = 2; i < 8; i += 2) {
              displayCtx.lineTo(held[i], held[i + 1]);
            }
            displayCtx.closePath();
            displayCtx.stroke();
          }
          detectMat.delete();
          if (active && mountedRef.current) {
            rafIdRef.current = requestAnimationFrame(processVideo);
          }
          return;
        }

        const guide = getROIFromGuide(detectW, detectH);
        const marginX = Math.round(detectW * 0.04);
        const marginY = Math.round(detectH * 0.04);
        const rx = Math.max(0, Math.min(guide[0], guide[6]) - marginX);
        const ry = Math.max(0, Math.min(guide[1], guide[3]) - marginY);
        const rRight = Math.min(
          detectW,
          Math.max(guide[2], guide[4]) + marginX
        );
        const rBottom = Math.min(
          detectH,
          Math.max(guide[5], guide[7]) + marginY
        );

        const cropMat = detectMat.roi(
          new cv.Rect(rx, ry, rRight - rx, rBottom - ry)
        );

        const detection = detectCardContoursWithFallback(cropMat, cv);

        const hasGlare = calculateGlareRatio(cropMat, cv) > 0.08;
        const isDark = calculateBrightness(cropMat, cv) < 0.22;

        cropMat.delete();

        flagFramesRef.current.glare = hasGlare
          ? flagFramesRef.current.glare + 1
          : 0;
        flagFramesRef.current.dark = isDark
          ? flagFramesRef.current.dark + 1
          : 0;

        const { method } = detection;
        const cropW = rRight - rx;
        const cropH = rBottom - ry;
        const CROP_EDGE_EPS = 2;
        const touchesCropEdge =
          method === 'contours' &&
          detection.found &&
          detection.corners.length === 8 &&
          detection.corners.some((c, i) =>
            i % 2 === 0
              ? c <= CROP_EDGE_EPS || c >= cropW - CROP_EDGE_EPS
              : c <= CROP_EDGE_EPS || c >= cropH - CROP_EDGE_EPS
          );
        const found = detection.found && !touchesCropEdge;

        const invScale = 1 / detectionScale;
        const corners = detection.corners.map((c, i) =>
          i % 2 === 0 ? (c + rx) * invScale : (c + ry) * invScale
        );

        const cardIsTooSmall =
          found &&
          corners.length === 8 &&
          Math.min(
            Math.hypot(corners[2] - corners[0], corners[3] - corners[1]),
            Math.hypot(corners[6] - corners[0], corners[7] - corners[1])
          ) <
            Math.min(currentWidth, currentHeight) * 0.32;

        flagFramesRef.current.tooSmall = cardIsTooSmall
          ? flagFramesRef.current.tooSmall + 1
          : 0;

        if (mountedRef.current) {
          setCaptureFlags((prev) => {
            const next = {
              glare: flagFramesRef.current.glare >= REQUIRED_FLAG_FRAMES,
              dark: flagFramesRef.current.dark >= REQUIRED_FLAG_FRAMES,
              tooSmall: flagFramesRef.current.tooSmall >= REQUIRED_FLAG_FRAMES,
            };
            return prev.glare === next.glare &&
              prev.dark === next.dark &&
              prev.tooSmall === next.tooSmall
              ? prev
              : next;
          });
        }

        if (mountedRef.current) {
          setDebugInfo(
            `${currentWidth}x${currentHeight} | Method:${method} | Stable:${stableFramesRef.current}`
          );
        }

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
              if (stableFramesRef.current < REQUIRED_STABLE_FRAMES) {
                clearFrameBuffer();
              }
              lastValidCornersRef.current = lastValidCornersRef.current
                ? lastValidCornersRef.current.map(
                    (v, i) => v * 0.6 + corners[i] * 0.4
                  )
                : [...corners];
              stableFramesRef.current = Math.min(
                stableFramesRef.current + 2,
                MAX_STABLE_FRAMES
              );
              shouldDrawContour = true;
              cornersToUse = lastValidCornersRef.current;

              if (stableFramesRef.current >= REQUIRED_STABLE_FRAMES) {
                let entry: IBufferedFrame | null = null;

                if (captureCtx) {
                  captureCanvas.width = currentWidth;
                  captureCanvas.height = currentHeight;
                  captureCtx.drawImage(
                    currentVideo,
                    0,
                    0,
                    currentWidth,
                    currentHeight
                  );
                  const fullData = captureCtx.getImageData(
                    0,
                    0,
                    currentWidth,
                    currentHeight
                  );
                  const fullMat = cv.matFromImageData(fullData);

                  if (fullMat && !fullMat.empty()) {
                    entry = {
                      mat: fullMat,
                      corners: [...cornersToUse],
                      width: currentWidth,
                      height: currentHeight,
                      sharpness: calculateSharpness(fullMat, cv),
                    };
                  } else if (fullMat) {
                    fullMat.delete();
                  }
                }

                if (entry) {
                  frameBufferRef.current.push(entry);
                }

                if (frameBufferRef.current.length > FRAME_BUFFER_SIZE) {
                  const evicted = frameBufferRef.current.shift();
                  if (evicted) {
                    evicted.mat.delete();
                    if (bestFrameRef.current === evicted) {
                      bestFrameRef.current =
                        frameBufferRef.current.reduce<IBufferedFrame | null>(
                          (best, e) =>
                            !best || e.sharpness > best.sharpness ? e : best,
                          null
                        );
                    }
                  }
                }

                if (
                  entry &&
                  (!bestFrameRef.current ||
                    entry.sharpness > bestFrameRef.current.sharpness)
                ) {
                  bestFrameRef.current = entry;
                }
              }
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

          if (isStable && displayCtx) {
            displayCtx.strokeStyle = 'rgba(34, 197, 94, 0.95)';
            displayCtx.lineWidth = 4;
            displayCtx.beginPath();
            displayCtx.moveTo(cornersToUse[0], cornersToUse[1]);
            for (let i = 2; i < 8; i += 2) {
              displayCtx.lineTo(cornersToUse[i], cornersToUse[i + 1]);
            }
            displayCtx.closePath();
            displayCtx.stroke();
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
          detectionMethodRef.current = 'none';
          if (mountedRef.current) {
            setCardDetected(false);
          }
        }

        detectMat.delete();

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

      for (const entry of frameBufferRef.current) {
        entry.mat.delete();
      }
      frameBufferRef.current = [];
      bestFrameRef.current = null;

      if (prevMotionMatRef.current && !prevMotionMatRef.current.isDeleted()) {
        prevMotionMatRef.current.delete();
      }
      prevMotionMatRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvReady, cv, isStreaming, resetTrigger]);

  return {
    bestFrame: bestFrameRef,
    latestCorners: latestCornersRef,
    detectionMethod: detectionMethodRef,
    cardDetected,
    captureFlags,
    resetDetection,
    debugInfo,
  };
};
