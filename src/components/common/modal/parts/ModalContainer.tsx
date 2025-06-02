import { ReactNode, useEffect } from "react";

import { classNames } from "@shared/utils/classNames";

type ModalContainerProps = {
  className?: string;
  children: ReactNode;
};

function ModalContainer({ children, className }: ModalContainerProps) {
  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const originalStyle = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    const existingPaddingRight = parseInt(
      originalStyle.paddingRight || "0",
      10
    );

    // 스크롤 방지 및 스크롤바 유지
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${(
      existingPaddingRight + scrollBarWidth
    ).toString()}px`;

    // 정리 작업: 스타일 복원
    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.paddingRight = originalStyle.paddingRight;
    };
  }, []);

  return (
    <div
      className={classNames(
        "fixed left-0 top-0 flex items-center justify-center",
        "z-40 h-full w-full bg-black/30",
        className
      )}
    >
      {children}
    </div>
  );
}

export { ModalContainer };
