import { ComponentProps } from "react";

import { classNames } from "@shared/utils/classNames";

export function Toggle({ checked, ...props }: ComponentProps<"input">) {
  return (
    <label
      className={classNames(
        "relative block",
        "h-[28px] w-[48px]",
        "cursor-pointer"
      )}
    >
      <input className="hidden" type="checkbox" {...props} checked={checked} />
      <span
        className={classNames(
          "block",
          "h-full w-full rounded-full transition-colors duration-300",
          checked ? "bg-talearnt_Primary_01" : "bg-talearnt_Icon_03"
        )}
      />
      <span
        className={classNames(
          "absolute left-[3px] top-[3px]",
          "h-[22px] w-[22px] rounded-full bg-talearnt_BG_Up_02 transition-transform duration-300",
          checked ? "translate-x-[20px]" : "translate-x-0"
        )}
      />
    </label>
  );
}
