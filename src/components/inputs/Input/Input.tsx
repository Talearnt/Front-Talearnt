import { ComponentProps, ReactNode, useEffect, useRef } from "react";

import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

import { classNames } from "@utils/classNames";

import { CompleteIcon } from "@components/icons/CompleteIcon/CompleteIcon";
import { ErrorIcon } from "@components/icons/ErrorIcon/ErrorIcon";

type InputProps = ComponentProps<"input"> & {
  children?: ReactNode;
  complete?: string;
  error?: string;
  formData?: UseFormRegisterReturn;
  insideNode?: ReactNode;
  label?: string;
  wrapperClassName?: string;
};

/**
 *
 * Input 컴포넌트
 * children - Node
 * error - 에러인 경우 보여줄 내용
 * label - label에 들어갈 내용
 * wrapperClassName - input을 감싸고 있는 wrapper에 들어갈 className
 * formData - react-hook-form 에서 사용하는 값들
 *
 * @param {string | undefined} className
 * @param {string | undefined} complete
 * @param {React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | Iterable<React.ReactNode> | React.ReactPortal | boolean | undefined | null | (undefined & React.ReactElement<any, string | React.JSXElementConstructor<any>>) | (undefined & Iterable<React.ReactNode>) | (undefined & React.ReactPortal)} children
 * @param {string | undefined} error
 * @param {UseFormRegisterReturn<UseFormRegisterReturn> | undefined} formData
 * @param {string | undefined} id
 * @param {string | undefined} insideNode
 * @param {string | undefined} label
 * @param {string | undefined} wrapperClassName
 * @param {Omit<InputProps, "wrapperClassName" | "children" | "className" | "formData" | "id" | "label" | "error">} props
 * @constructor
 */
function Input({
  className,
  complete,
  children,
  error,
  formData,
  id,
  insideNode,
  label,
  wrapperClassName,
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const insideNodeRef = useRef<HTMLDivElement>(null);

  const hasComplete = complete !== undefined;
  const hasError = !!error;

  const combinedRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (formData?.ref) {
      formData.ref(node);
    }
  };

  useEffect(() => {
    if (insideNodeRef.current && inputRef.current) {
      const insideNodeWidth = insideNodeRef.current.offsetWidth;

      inputRef.current.style.paddingRight = `${(insideNodeWidth + 8).toString()}px`;
    }
  }, [insideNode]);

  return (
    <div className={classNames("flex flex-col", "w-full", wrapperClassName)}>
      {label && (
        <label className={"mb-2 text-body2_16_medium"} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={"relative flex"}>
        <input
          className={classNames(
            "peer/input",
            "h-[50px] w-full rounded-lg border bg-talearnt_BG_Background px-[15px]",
            "text-body2_16_medium placeholder:text-talearnt_Text_04",
            "focus:border-talearnt_Primary_01 focus:outline-none",
            "disabled:cursor-not-allowed disabled:bg-talearnt_BG_Up_01 disabled:text-talearnt_Text_04",
            "hover:border-talearnt_PrimaryBG_03",
            error !== undefined
              ? "border-talearnt_Error_02 focus:border-talearnt_Error_02"
              : "border-talearnt_Line_01",
            className
          )}
          id={id}
          {...formData}
          {...props}
          ref={combinedRef}
        />
        {children}
        {insideNode && (
          <div
            className={"absolute right-2 top-1/2 -translate-y-1/2"}
            ref={insideNodeRef}
          >
            {insideNode}
          </div>
        )}
      </div>
      {(hasComplete || hasError) && (
        <div className={"mt-1 flex items-center gap-0.5"}>
          {hasComplete && <CompleteIcon />}
          {hasError && <ErrorIcon />}
          <span
            className={classNames(
              "text-caption1_14_medium",
              hasError && "text-talearnt_Error_01",
              hasComplete && "text-talearnt_Primary_01"
            )}
          >
            {hasComplete && complete}
            {hasError && error}
          </span>
        </div>
      )}
    </div>
  );
}

export { Input };
