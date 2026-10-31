import { useEffect, useState, useRef } from 'react';
import { OpenCV } from '../../domain/types';

declare global {
  interface Window {
    cv: OpenCV;
  }
}

export const useOpenCV = () => {
  const [cvReady, setCvReady] = useState(false);
  const [cv, setCv] = useState<OpenCV | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const checkIntervalRef: { current: NodeJS.Timeout | undefined } = {
      current: undefined,
    };
    const timeoutIdRef: { current: NodeJS.Timeout | undefined } = {
      current: undefined,
    };
    const checkOpenCV = () => {
      if (!mountedRef.current) return;

      if (typeof window !== 'undefined' && window.cv) {
        if (window.cv.getBuildInformation) {
          if (mountedRef.current) {
            setCv(window.cv);
            setCvReady(true);
          }
          if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
          if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        } else {
          window.cv.onRuntimeInitialized = () => {
            if (mountedRef.current) {
              setCv(window.cv);
              setCvReady(true);
            }
            if (checkIntervalRef.current)
              clearInterval(checkIntervalRef.current);
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
          };
        }
      }
    };

    checkOpenCV();

    checkIntervalRef.current = setInterval(checkOpenCV, 500);

    timeoutIdRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      if (!cvReady) {
        if (mountedRef.current) {
          setError(
            'OpenCV.js no se pudo cargar. Verifica tu conexión a internet.'
          );
        }
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      }
    }, 30000);

    return () => {
      mountedRef.current = false;
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [cvReady]);

  return { cvReady, cv, error };
};
