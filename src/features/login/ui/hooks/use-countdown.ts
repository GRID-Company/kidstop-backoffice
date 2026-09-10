import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  durationSeconds: number;
}

interface UseCountdownReturn {
  isActive: boolean;
  display: string;
  start: () => void;
}

export function useCountdown({
  durationSeconds,
}: UseCountdownOptions): UseCountdownReturn {
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    setRemaining(durationSeconds);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [durationSeconds, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    isActive: remaining > 0,
    display,
    start,
  };
}
