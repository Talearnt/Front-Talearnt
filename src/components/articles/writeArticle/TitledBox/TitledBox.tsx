import { ReactNode } from "react";

import { classNames } from "@shared/utils/classNames";

import { CaretIcon } from "@components/common/icons/caret/CaretIcon/CaretIcon";

type TitledBoxProps = {
  canOpen?: boolean;
  children: ReactNode;
  className?: string;
  title: ReactNode;
};

function TitledBox({ canOpen, children, className, title }: TitledBoxProps) {
  return (
    <div
      className={classNames(
        "flex flex-col",
        "rounded-xl border border-talearnt_Line_01",
        className
      )}
    >
      <label
        className={classNames(
          "peer/label",
          "flex items-center justify-between gap-4",
          "px-6 py-[18px]",
          "has-[:checked]:border-b has-[:checked]:border-talearnt_Line_01",
          canOpen && "cursor-pointer"
        )}
      >
        <input
          className={"peer/checkbox hidden"}
          type={"checkbox"}
          checked={!canOpen ? true : undefined}
          readOnly={!canOpen}
        />
        {title}
        {canOpen && (
          <CaretIcon
            className={classNames(
              "stroke-talearnt_Icon_01",
              "peer-checked/checkbox:-rotate-90"
            )}
            direction={"bottom"}
          />
        )}
      </label>
      <div
        className={classNames(
          "hidden",
          "px-[23px] pb-[31px] pt-8",
          "peer-has-[:checked]/label:block"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { TitledBox };
