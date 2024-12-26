import { ReactNode } from "react";

import { classNames } from "@utils/classNames";

import { CloseIcon } from "@components/icons/CloseIcon/CloseIcon";

type ModalHeaderProps = {
  children: ReactNode;
  onCloseHandler?: () => void;
};

function ModalHeader({ children, onCloseHandler }: ModalHeaderProps) {
  return (
    <div
      className={classNames(
        "relative flex flex-col items-center justify-center",
        "h-[150px]"
      )}
    >
      {onCloseHandler && (
        <CloseIcon
          className={classNames("absolute right-[32px] top-[32px]")}
          onClick={onCloseHandler}
        />
      )}
      {children}
    </div>
  );
}

export { ModalHeader };
