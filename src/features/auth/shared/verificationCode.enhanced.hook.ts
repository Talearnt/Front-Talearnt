import { useCallback, useEffect, useRef, useState } from "react";

import {
  useSendVerificationCode,
  useConfirmVerificationCode,
} from "@features/auth/auth.hook";

import { verificationBodyType } from "@features/auth/shared/verificationCode.type";

/**
 * 향상된 인증번호 타이머 - 자동 재시작 기능 포함
 */
export function useVerificationCodeTimer(initialSecond = 180) {
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
    setTime(initialSecond);

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
  }, [isRunning, stopTimer, initialSecond]);

  const restartTimer = useCallback(() => {
    stopTimer();
    setTimeout(() => startTimer(), 100); // 짧은 지연 후 재시작
  }, [stopTimer, startTimer]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    time: formatTime(time),
    rawTime: time,
    isFinished,
    isRunning,
    startTimer,
    stopTimer,
    restartTimer,
  };
}

/**
 * 통합 인증번호 관리 hook
 */
export function useVerificationCodeManager<T = any>(initialSecond = 180) {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<T | null>(null);

  const timer = useVerificationCodeTimer(initialSecond);
  const sendCodeMutation = useSendVerificationCode();
  const confirmCodeMutation = useConfirmVerificationCode<T>();

  const sendVerificationCode = useCallback(
    (data: verificationBodyType) => {
      sendCodeMutation.mutate(data, {
        onSuccess: () => {
          setPhone(data.phone);
          timer.restartTimer();
        },
      });
    },
    [sendCodeMutation, timer]
  );

  const confirmVerificationCode = useCallback(
    (data: verificationBodyType & { code: string }) => {
      confirmCodeMutation.mutate(data, {
        onSuccess: response => {
          setIsCodeVerified(true);
          setVerificationData(response.data);
          timer.stopTimer();
        },
      });
    },
    [confirmCodeMutation, timer]
  );

  const resetVerification = useCallback(() => {
    setPhone("");
    setVerificationCode("");
    setIsCodeVerified(false);
    setVerificationData(null);
    timer.stopTimer();
  }, [timer]);

  return {
    // 상태
    phone,
    verificationCode,
    isCodeVerified,
    verificationData,

    // 타이머
    timer,

    // 뮤테이션
    sendCodeMutation,
    confirmCodeMutation,

    // 액션
    sendVerificationCode,
    confirmVerificationCode,
    resetVerification,

    // 설정
    setPhone,
    setVerificationCode,
  };
}
