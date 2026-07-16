// A reusable countdown hook for study/answer timers.

import { useCallback, useEffect, useRef, useState } from 'react';

interface Countdown {
  /** Seconds remaining (float). */
  remaining: number;
  running: boolean;
  start: (seconds: number) => void;
  stop: () => void;
}

export function useCountdown(onDone?: () => void): Countdown {
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const tick = useCallback(() => {
    const left = Math.max(0, (endRef.current - Date.now()) / 1000);
    setRemaining(left);
    if (left <= 0) {
      setRunning(false);
      doneRef.current?.();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(
    (seconds: number) => {
      cancelAnimationFrame(rafRef.current);
      endRef.current = Date.now() + seconds * 1000;
      setRemaining(seconds);
      setRunning(true);
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setRunning(false);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { remaining, running, start, stop };
}
