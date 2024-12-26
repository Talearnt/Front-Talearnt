import { ReactNode } from "react";

import { classNames } from "@utils/classNames";

import { useLockBodyScroll } from "@hook/useLockBodyScroll";

type ModalContainerProps = {
  className?: string;
  children: ReactNode;
};

function ModalContainer({ children, className }: ModalContainerProps) {
  useLockBodyScroll();

  return (
    <div
      className={classNames(
        "fixed left-0 top-0 flex justify-center",
        "h-full w-full bg-black/30",
        className
      )}
    >
      {children}
    </div>
  );
}

export { ModalContainer };
