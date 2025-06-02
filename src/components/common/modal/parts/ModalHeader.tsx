import { ReactNode } from "react";

import { classNames } from "@shared/utils/classNames";

import { CloseIcon } from "@components/common/icons/CloseIcon/CloseIcon";

type ModalHeaderProps = {
  className?: string;
  children: ReactNode;
  onCloseHandler?: () => void;
};

function ModalHeader({
  className,
  children,
  onCloseHandler,
}: ModalHeaderProps) {
  return (
    <div
      className={classNames(
        "relative",
        "flex flex-col items-center justify-center",
        "h-[150px]",
        className
      )}
    >
      {onCloseHandler && (
        <CloseIcon
          className={"absolute right-[32px] top-[32px]"}
          onClick={onCloseHandler}
        />
      )}
      {children}
    </div>
  );
}

export { ModalHeader };
