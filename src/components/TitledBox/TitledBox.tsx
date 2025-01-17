import { ReactNode } from "react";

import { classNames } from "@utils/classNames";

type TitledBoxProps = {
  title: ReactNode;
  children: ReactNode;
};

function TitledBox({ title, children }: TitledBoxProps) {
  return (
    <div
      className={classNames(
        "flex flex-col",
        "rounded-xl shadow-[inset_0_0_0_1px] shadow-talearnt-Line_01"
      )}
    >
      <div
        className={
          "px-6 py-[19px] shadow-[inset_0_-1px_0_0] shadow-talearnt-Line_01"
        }
      >
        {title}
      </div>
      <div className={"px-6 py-8"}>{children}</div>
    </div>
  );
}

export { TitledBox };
