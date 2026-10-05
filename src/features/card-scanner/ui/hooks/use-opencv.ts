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
    let checkCount = 0;

    const checkOpenCV = () => {
      if (!mountedRef.current) return;

      checkCount++;
      console.error(`🔍 [${checkCount}] Verificando OpenCV.js...`);

      if (typeof window !== 'undefined' && window.cv) {
        if (window.cv.getBuildInformation) {
          console.error('✅ OpenCV.js ya estaba cargado');
          if (mountedRef.current) {
            setCv(window.cv);
            setCvReady(true);
          }
          if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
          if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        } else {
          console.error('⏳ Esperando inicialización de OpenCV.js...');
          window.cv.onRuntimeInitialized = () => {
            console.error('✅ OpenCV.js inicializado correctamente');
            if (mountedRef.current) {
              setCv(window.cv);
              setCvReady(true);
            }
            if (checkIntervalRef.current)
              clearInterval(checkIntervalRef.current);
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
          };
        }
      } else {
        console.error('⏳ window.cv aún no existe');
      }
    };

    console.error('🔍 Esperando carga de OpenCV.js desde CDN...');
    console.error('📡 CDN URL: https://docs.opencv.org/4.10.0/opencv.js');
    checkOpenCV();

    checkIntervalRef.current = setInterval(checkOpenCV, 500);

    timeoutIdRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      if (!cvReady) {
        console.error('❌ Timeout: OpenCV.js no se cargó en 30 segundos');
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
