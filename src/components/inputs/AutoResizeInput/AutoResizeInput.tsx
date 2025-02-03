import { ComponentProps, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

function AutoResizeInput({ onChange, ...props }: ComponentProps<"input">) {
  const measureWidthRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, watch } = useForm<{ text: string }>();

  const value = watch("text");

  const combinedRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    register("text").ref(node);
  };

  useEffect(() => {
    if (!measureWidthRef.current || !inputRef.current) {
      return;
    }

    const mirrorWidth = measureWidthRef.current.offsetWidth;
    inputRef.current.style.width = `${mirrorWidth.toString()}px`;
  }, [value]);

  return (
    <>
      <input {...register("text", { onChange })} {...props} ref={combinedRef} />
      {/*input 내부 value size 측정용 span | Span for measuring the size of the value inside the input*/}
      <span
        aria-hidden={true}
        ref={measureWidthRef}
        className={"invisible absolute min-w-[1ch] whitespace-pre"}
      >
        {value || props.placeholder || ""}
      </span>
    </>
  );
}

export { AutoResizeInput };
