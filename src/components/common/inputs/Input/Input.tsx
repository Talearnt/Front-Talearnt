import { ComponentProps, ReactNode, useEffect, useRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

import { classNames } from "@shared/utils/classNames";

import { CompleteIcon } from "@components/common/icons/CompleteIcon/CompleteIcon";
import { ErrorIcon } from "@components/common/icons/ErrorIcon/ErrorIcon";

const inputVariants = cva(
  classNames(
    "peer/input",
    "w-full border bg-talearnt_BG_Background",
    "placeholder:text-talearnt_Text_04 focus:border-talearnt_Primary_01 focus:outline-none",
    "disabled:cursor-not-allowed disabled:bg-talearnt_BG_Up_01 disabled:text-talearnt_Text_04"
  ),
  {
    variants: {
      size: {
        small: "h-[50px] pl-[15px] rounded-lg text-body2_16_medium",
        large: "h-[60px] pl-[23px] rounded-xl text-heading4_20_semibold",
      },
    },
    defaultVariants: {
      size: "small",
    },
  }
);

type InputProps = VariantProps<typeof inputVariants> &
  Omit<ComponentProps<"input">, "size"> & {
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
 * @param {string} size
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
  size,
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
    if (!inputRef.current) {
      return;
    }

    if (insideNodeRef.current) {
      const insideNodeWidth = insideNodeRef.current.offsetWidth;

      inputRef.current.style.paddingRight = `${insideNodeWidth + 8 + (size === "large" ? 23 : 8)}px`;
    } else {
      inputRef.current.style.paddingRight = `${size === "large" ? 23 : 15}px`;
    }
  }, [insideNode, size]);

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
            inputVariants({ size }),
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
            className={classNames(
              "absolute right-2 top-1/2 -translate-y-1/2",
              size === "large" && "right-6"
            )}
            ref={insideNodeRef}
          >
            {insideNode}
          </div>
        )}
      </div>
      {(hasComplete || hasError) && (
        <div className={"mt-1 flex items-center gap-1"}>
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
