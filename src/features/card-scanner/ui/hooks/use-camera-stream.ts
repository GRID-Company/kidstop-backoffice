import { useEffect, useState, RefObject, useRef, useCallback } from 'react';
import { CAMERA_CONFIG } from '../../domain/constants';

export const useCameraStream = (
  videoRef: RefObject<HTMLVideoElement | null>
) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<
    'prompt' | 'granted' | 'denied'
  >('prompt');
  const [isInitializing, setIsInitializing] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const torchEnabledRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const mountedRef = useRef(true);
  const streamRef = useRef<MediaStream | null>(null);

  const checkTorchSupport = (stream: MediaStream): boolean => {
    try {
      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack) return false;

      const capabilities = videoTrack.getCapabilities();
      const supported = 'torch' in capabilities && capabilities.torch === true;

      if (mountedRef.current) {
        setTorchSupported(supported);
      }
      return supported;
    } catch (err) {
      console.warn('Error checking torch support:', err);
      if (mountedRef.current) {
        setTorchSupported(false);
      }
      return false;
    }
  };

  const toggleTorch = async (enabled: boolean): Promise<boolean> => {
    if (!videoRef.current?.srcObject) {
      console.warn('No video stream available for torch control');
      return false;
    }

    try {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];

      if (!videoTrack) {
        console.warn('No video track available');
        return false;
      }

      await videoTrack.applyConstraints({
        advanced: [{ torch: enabled } as MediaTrackConstraintSet],
      });

      if (mountedRef.current) {
        setTorchEnabled(enabled);
      }
      torchEnabledRef.current = enabled;
      return true;
    } catch (err) {
      console.error('Error toggling torch:', err);
      return false;
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.error('🛑 Track stopped:', track.kind);
      });

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      streamRef.current = null;

      if (mountedRef.current) {
        setIsStreaming(false);
      }
    }
  }, [videoRef]);

  const startCamera = useCallback(() => {
    if (!mountedRef.current) return;

    stopCamera();

    console.error('🔵 [startCamera] Función llamada');
    if (mountedRef.current) {
      setIsInitializing(true);
    }
    console.error('🎥 Solicitando acceso a la cámara...');
    console.error('📱 User Agent:', navigator.userAgent);
    console.error('🔒 isSecureContext:', window.isSecureContext);
    console.error('📍 Location:', window.location.href);

    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      const errorMsg = 'HTTPS requerido para acceso a cámara';
      console.error('❌', errorMsg);
      if (mountedRef.current) {
        setError(errorMsg);
        setIsInitializing(false);
      }
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMsg = 'getUserMedia no está disponible en este navegador';
      console.error('❌', errorMsg);
      if (mountedRef.current) {
        setError(errorMsg);
        setIsInitializing(false);
      }
      return;
    }

    console.error('📹 Llamando a getUserMedia con config:', CAMERA_CONFIG);

    navigator.mediaDevices
      .getUserMedia({
        video: CAMERA_CONFIG,
        audio: false,
      })
      .then((stream) => {
        if (!mountedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        console.error('✅ Acceso a cámara concedido');
        console.error('📊 Stream tracks:', stream.getTracks().length);

        streamRef.current = stream;

        if (mountedRef.current) {
          setPermissionState('granted');
          setError(null);
        }

        checkTorchSupport(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            if (!mountedRef.current || !videoRef.current) return;

            videoRef.current
              .play()
              .then(() => {
                if (!mountedRef.current) return;
                console.error('▶️ Video reproduciendo');
                setIsStreaming(true);
                setIsInitializing(false);
              })
              .catch((playErr) => {
                if (!mountedRef.current) return;
                console.error('❌ Error al reproducir video:', playErr);
                setError('Error al reproducir el video');
                setIsInitializing(false);
              });
          };
        } else {
          console.warn('⚠️ videoRef.current es null');
          if (mountedRef.current) {
            setError('Referencia de video no disponible');
            setIsInitializing(false);
          }
        }
      })
      .catch((err) => {
        if (!mountedRef.current) return;

        console.error('❌ Error accediendo a la cámara:', err);
        setIsInitializing(false);

        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setPermissionState('denied');
            setError(
              'Permiso de cámara denegado. Por favor, permite el acceso en la configuración.'
            );
          } else if (err.name === 'NotFoundError') {
            setError('No se encontró ninguna cámara en el dispositivo.');
          } else if (err.name === 'NotReadableError') {
            setError('La cámara está siendo usada por otra aplicación.');
          } else if (err.name === 'SecurityError') {
            setError(
              'HTTPS requerido. Acceso a cámara solo disponible en conexión segura.'
            );
          } else if (err.name === 'TypeError') {
            setError('Cámara no disponible en este navegador.');
          } else if (err.name === 'AbortError') {
            setError('Solicitud de cámara cancelada.');
          } else {
            setError(err.message);
          }
        } else {
          setError('Error desconocido al acceder a la cámara');
        }
      });
  }, [videoRef, stopCamera]);

  useEffect(() => {
    mountedRef.current = true;

    if (hasInitializedRef.current) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (!isIOS) {
      startCamera();
      hasInitializedRef.current = true;
    }

    return () => {
      mountedRef.current = false;

      if (torchEnabledRef.current && streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack
            .applyConstraints({
              advanced: [{ torch: false } as MediaTrackConstraintSet],
            })
            .catch((err) =>
              console.warn('Error disabling torch on cleanup:', err)
            );
        }
      }

      stopCamera();
      console.error('🛑 Camera stream stopped on component unmount');
    };
  }, [startCamera, stopCamera]);

  return {
    isStreaming,
    error,
    permissionState,
    startCamera,
    isInitializing,
    torchSupported,
    torchEnabled,
    toggleTorch,
  };
};
