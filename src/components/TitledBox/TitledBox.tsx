import { ReactNode } from "react";

import { classNames } from "@utils/classNames";

import { CaretIcon } from "@components/icons/CaretIcon/CaretIcon";

type TitledBoxProps = {
  title: ReactNode;
  children: ReactNode;
  canOpen?: boolean;
};

function TitledBox({ title, children, canOpen }: TitledBoxProps) {
  return (
    <div
      className={classNames(
        "flex flex-col",
        "rounded-xl shadow-[inset_0_0_0_1px] shadow-talearnt-Line_01"
      )}
    >
      <label
        className={classNames(
          "peer/label",
          "flex items-center justify-between gap-4",
          "px-6 py-[19px]",
          "has-[:checked]:shadow-[inset_0_-1px_0_0] has-[:checked]:shadow-talearnt-Line_01",
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
              "stroke-talearnt-Icon_01",
              "peer-checked/checkbox:rotate-180"
            )}
          />
        )}
      </label>
      <div
        className={classNames(
          "hidden",
          "px-6 py-8",
          "peer-has-[:checked]/label:block"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { TitledBox };
