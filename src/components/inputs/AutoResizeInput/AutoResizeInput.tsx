import { ComponentProps, useEffect, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

type AutoResizeInputProps = ComponentProps<"input"> & {
  formData?: UseFormRegisterReturn;
};

function AutoResizeInput({
  placeholder,
  value,
  formData,
  ...props
}: AutoResizeInputProps) {
  const measureWidthRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const combinedRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (formData?.ref) {
      formData.ref(node);
    }
  };

  useEffect(() => {
    if (!measureWidthRef.current || !inputRef.current) {
      return;
    }

    inputRef.current.style.width = `${measureWidthRef.current.offsetWidth.toString()}px`;
  }, [value, placeholder]);

  return (
    <>
      <input
        placeholder={placeholder}
        {...formData}
        {...props}
        ref={combinedRef}
      />
      {/*input 내부 value size 측정용 span | Span for measuring the size of the value inside the input*/}
      <span
        aria-hidden={true}
        ref={measureWidthRef}
        className={"invisible absolute min-w-[1ch] whitespace-pre"}
      >
        {value || placeholder || ""}
      </span>
    </>
  );
}

export { AutoResizeInput };
