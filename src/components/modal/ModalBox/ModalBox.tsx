import { ReactNode } from "react";

import { classNames } from "@utils/classNames";

type ModalBoxProps = {
  className?: string;
  children: ReactNode;
};

function ModalBox({ className, children }: ModalBoxProps) {
  return (
    <div
      className={classNames(
        "flex flex-col",
        "h-fit w-[600px] overflow-hidden rounded-3xl bg-talearnt-BG_Background",
        className
      )}
    >
      {children}
    </div>
  );
}

export { ModalBox };
