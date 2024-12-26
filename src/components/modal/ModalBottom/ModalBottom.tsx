import { ReactNode } from "react";

import { classNames } from "@utils/classNames";

type ModalBottomProps = {
  children: ReactNode;
};

function ModalBottom({ children }: ModalBottomProps) {
  return (
    <div className={classNames("flex items-center", "h-[120px]")}>
      {children}
    </div>
  );
}

export { ModalBottom };
