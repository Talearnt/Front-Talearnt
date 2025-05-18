import { ComponentProps } from "react";

import { classNames } from "@utils/classNames";

import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";

type MoveButtonProps = ComponentProps<"button"> & { text: string };

function MoveButton({ className, text, ...props }: MoveButtonProps) {
  return (
    <button
      className={classNames(
        "flex items-center gap-4",
        "mx-auto h-[50px] w-fit rounded-full bg-talearnt_BG_Up_01 px-4",
        className
      )}
      {...props}
    >
      <span className={"text-body2_16_semibold text-talearnt_Text_Strong"}>
        {text}
      </span>
      <CaretIcon
        className={
          "rounded-full bg-talearnt_Primary_01 stroke-talearnt_On_Icon"
        }
        size={30}
      />
    </button>
  );
}

export { MoveButton };
