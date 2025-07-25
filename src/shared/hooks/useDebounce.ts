import { useEffect, useState } from "react";

const useDebounce = <T = string>(
  value: T,
  {
    delay = 300,
    returnUndefinedBeforeDebounce = false,
  }: { delay?: number; returnUndefinedBeforeDebounce?: boolean } = {}
) => {
  const [debouncedValue, setDebouncedValue] = useState<T | undefined>(value);

  useEffect(() => {
    // 타이머가 시작됩니다.
    const handler = setTimeout(() => {
      setDebouncedValue(value); // 지정된 delay 후에 값을 업데이트
    }, delay);

    // 컴포넌트가 언마운트되거나 value 또는 delay가 변경될 때
    // 이전 타이머를 정리하고 새로운 타이머를 설정합니다.
    return () => {
      clearTimeout(handler);
      if (returnUndefinedBeforeDebounce) {
        setDebouncedValue(undefined);
      }
    };
  }, [value, delay, returnUndefinedBeforeDebounce]); // value나 delay가 변경될 때마다 실행됩니다.

  return debouncedValue; // 디바운싱된 값을 반환합니다.
};

export { useDebounce };
