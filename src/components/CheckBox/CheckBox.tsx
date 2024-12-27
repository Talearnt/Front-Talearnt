import { ChangeEvent, ComponentProps } from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

import { classNames } from "@utils/classNames";

import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";

type InputProps = ComponentProps<"input"> & {
  formData?: UseFormRegisterReturn;
};

function CheckBox({
  className,
  children,
  formData,
  onChange,
  ...props
}: InputProps) {
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (formData?.onChange) {
      await formData.onChange(e); // react-hook-form의 onChange 호출
    }

    if (onChange) {
      onChange(e); // 외부에서 전달된 onChange 호출
    }
  };

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
        onChange={handleChange}
      />
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
