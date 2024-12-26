import { ReactNode } from "react";

import { classNames } from "@utils/classNames";

type ModalBodyProps = {
  children: ReactNode;
};

function ModalBody({ children }: ModalBodyProps) {
  return <div className={classNames("flex flex-col")}>{children}</div>;
}

export { ModalBody };
