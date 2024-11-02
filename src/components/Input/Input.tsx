import { ComponentProps, ReactNode } from "react";

import { classNames } from "@utils/classNames";

import { ErrorIcon } from "@components/icons/ErrorIcon/ErrorIcon";

type InputProps = ComponentProps<"input"> & {
  children: ReactNode;
  error?: {
    errorContent: string;
    hasError: boolean;
  };
  label?: string;
  wrapperClassName?: string;
};

function Input({
  className,
  children,
  error,
  id,
  label,
  wrapperClassName,
  ...props
}: InputProps) {
  return (
    <div
      className={classNames("relative flex w-full flex-col", wrapperClassName)}
    >
      {label && (
        <label className={"mb-2 text-base"} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className={classNames(
          "h-[50px] w-full rounded-lg border bg-talearnt-BG_Background px-[15px] text-[1rem] placeholder:text-talearnt-Text_04 focus:border-talearnt-Primary_01 focus:outline-none disabled:cursor-not-allowed disabled:bg-talearnt-BG_Up_01",
          error?.hasError
            ? "border-talearnt-Error_02 focus:border-talearnt-Error_02"
            : "border-talearnt-Line_01",
          className
        )}
        id={id}
        {...props}
      />
      {error?.hasError && (
        <div className={"mt-1 flex items-center gap-0.5"}>
          <ErrorIcon />
          <p className={"text-[0.875rem] font-medium text-talearnt-Error_01"}>
            {error.errorContent}
          </p>
        </div>
      )}
      {children}
    </div>
  );
}

export { Input };
