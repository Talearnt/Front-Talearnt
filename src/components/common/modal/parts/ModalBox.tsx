import { ReactNode } from "react";

import { classNames } from "@shared/utils/classNames";

type ModalBoxProps = {
  className?: string;
  children: ReactNode;
};

function ModalBox({ className, children }: ModalBoxProps) {
  return (
    <div
      className={classNames(
        "flex flex-col",
        "h-fit overflow-hidden rounded-3xl bg-talearnt_BG_Background shadow-shadow_03",
        className
      )}
    >
      {children}
    </div>
  );
}

export { ModalBox };
