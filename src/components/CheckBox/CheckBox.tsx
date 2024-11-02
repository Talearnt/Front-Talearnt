import { ComponentProps } from "react";

import { classNames } from "@utils/classNames";

import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";

type InputProps = ComponentProps<"input">;

function CheckBox({ className, children, ...props }: InputProps) {
  return (
    <label
      className={classNames(
        "flex cursor-pointer items-center gap-2",
        className
      )}
    >
      <input className={"peer hidden"} type={"checkbox"} {...props} />
      <CircleCheckIcon
        className={
          "peer-checked:fill-talearnt-Primary_01 peer-checked:stroke-white"
        }
      />
      {children}
    </label>
  );
}

export { CheckBox };
