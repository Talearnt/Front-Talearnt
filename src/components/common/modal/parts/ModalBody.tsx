import { ReactNode, RefObject } from "react";

import { classNames } from "@shared/utils/classNames";

type ModalBodyProps = {
  bodyRef?: RefObject<HTMLDivElement>;
  className?: string;
  children: ReactNode;
};

function ModalBody({ bodyRef, className, children }: ModalBodyProps) {
  return (
    <div className={classNames("flex flex-col", className)} ref={bodyRef}>
      {children}
    </div>
  );
}

export { ModalBody };
