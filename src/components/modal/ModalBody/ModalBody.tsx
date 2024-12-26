import { ReactNode } from "react";

import { classNames } from "@utils/classNames";

type ModalBodyProps = {
  className?: string;
  children: ReactNode;
};

function ModalBody({ className, children }: ModalBodyProps) {
  return (
    <div className={classNames("flex flex-col", className)}>{children}</div>
  );
}

export { ModalBody };
