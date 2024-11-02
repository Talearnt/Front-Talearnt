import { ComponentProps } from "react";

import { classNames } from "@utils/classNames";

import { ErrorIcon } from "@components/icons/ErrorIcon/ErrorIcon";

type InputProps = ComponentProps<"input"> & {
  error?: {
    errorContent: string;
    hasError: boolean;
  };
};

function Input({ className, children, error, ...props }: InputProps) {
  return (
    <div className={"flex flex-col"}>
      <input
        className={classNames(
          "h-[50px] w-full rounded-lg border bg-talearnt-BG_Background px-[15px] text-[1rem] placeholder:text-talearnt-Text_04 focus:border-talearnt-Primary_01 focus:outline-none disabled:cursor-not-allowed disabled:bg-talearnt-BG_Up_01",
          error?.hasError
            ? "border-talearnt-Error_02 focus:border-talearnt-Error_02"
            : "border-talearnt-Line_01",
          className
        )}
        {...props}
      >
        {children}
      </input>
      {error?.hasError && (
        <div className={"mt-1 flex items-center gap-0.5"}>
          <ErrorIcon />
          <p className={"text-[0.875rem] font-medium text-talearnt-Error_01"}>
            {error.errorContent}
          </p>
        </div>
      )}
    </div>
  );
}

export { Input };
