import { ComponentProps, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

import { classNames } from "@utils/classNames";

import { ErrorIcon } from "@components/icons/ErrorIcon/ErrorIcon";

type InputProps = ComponentProps<"input"> & {
  children?: ReactNode;
  error?: {
    errorContent: string;
    hasError: boolean;
  };
  formData?: UseFormRegisterReturn;
  label?: string;
  wrapperClassName?: string;
};

/**
 *
 * Input 컴포넌트
 * children - Node
 * error.errorContent - 에러인 경우 보여줄 내용
 * error.hasError - 에러인지 알려주는 플래그
 * label - label에 들어갈 내용
 * wrapperClassName - input을 감싸고 있는 wrapper에 들어갈 className
 * formData - react-hook-form 에서 사용하는 값들
 *
 * @param {string | undefined} className
 * @param {React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | Iterable<React.ReactNode> | React.ReactPortal | boolean | undefined | null | (undefined & React.ReactElement<any, string | React.JSXElementConstructor<any>>) | (undefined & Iterable<React.ReactNode>) | (undefined & React.ReactPortal)} children
 * @param {{errorContent: string, hasError: boolean} | undefined} error
 * @param {UseFormRegisterReturn<UseFormRegisterReturn> | undefined} formData
 * @param {string | undefined} id
 * @param {string | undefined} label
 * @param {string | undefined} wrapperClassName
 * @param {Omit<InputProps, "wrapperClassName" | "children" | "className" | "formData" | "id" | "label" | "error">} props
 * @constructor
 */
function Input({
  className,
  children,
  error,
  formData,
  id,
  label,
  wrapperClassName,
  ...props
}: InputProps) {
  return (
    <div className={classNames("flex flex-col", "w-full", wrapperClassName)}>
      {label && (
        <label className={"mb-2 text-base"} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={classNames("flex")}>
        <input
          className={classNames(
            "h-[50px] w-full rounded-lg border bg-talearnt-BG_Background px-[15px] text-[1rem] placeholder:text-talearnt-Text_04 focus:border-talearnt-Primary_01 focus:outline-none disabled:cursor-not-allowed disabled:bg-talearnt-BG_Up_01",
            error?.hasError
              ? "border-talearnt-Error_02 focus:border-talearnt-Error_02"
              : "border-talearnt-Line_01",
            className
          )}
          id={id}
          {...formData}
          {...props}
        />
        {children}
      </div>
      {error?.hasError && error.errorContent && (
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
