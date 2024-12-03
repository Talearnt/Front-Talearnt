import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer(initialSecond = 180) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [time, setTime] = useState(initialSecond);
  const [isFinished, setIsFinished] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTime(initialSecond);
    setIsRunning(false);
  }, [initialSecond]);

  const startTimer = useCallback(() => {
    if (isRunning) return;

    setIsFinished(false);
    setIsRunning(true);

    timerRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime === 1) {
          stopTimer();
          setIsFinished(true);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
  }, [isRunning, stopTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    time: formatTime(time),
    isFinished,
    isRunning,
    startTimer,
    stopTimer
  };
}
