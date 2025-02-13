import { ComponentProps } from "react";

import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

import { classNames } from "@utils/classNames";

import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";

type InputProps = ComponentProps<"input"> & {
  formData?: UseFormRegisterReturn;
};

function Checkbox({ className, children, formData, ...props }: InputProps) {
  return (
    <label
      className={classNames(
        "flex cursor-pointer items-center gap-2",
        className
      )}
    >
      <input
        className={"peer hidden"}
        type={"checkbox"}
        {...formData}
        {...props}
      />
      <CircleCheckIcon
        className={
          "peer-checked:fill-talearnt_Primary_01 peer-checked:stroke-white"
        }
      />
      {children}
    </label>
  );
}

export { Checkbox };
