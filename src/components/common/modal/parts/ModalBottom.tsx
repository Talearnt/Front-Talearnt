import { ReactNode } from "react";

import { classNames } from "@shared/utils/classNames";

type ModalBottomProps = {
  className?: string;
  children: ReactNode;
};

function ModalBottom({ className, children }: ModalBottomProps) {
  return (
    <div className={classNames("flex items-center", "h-[120px]", className)}>
      {children}
    </div>
  );
}

export { ModalBottom };
