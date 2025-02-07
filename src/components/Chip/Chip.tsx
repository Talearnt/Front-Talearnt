import { ReactNode } from "react";

import { cva } from "class-variance-authority";

import { classNames } from "@utils/classNames";

import { CloseIcon } from "@components/icons/CloseIcon/CloseIcon";

import { CustomVariantProps } from "@common/common.type";

type ChipVariantsType = {
  type: Record<"default" | "keyword", string>;
};

type ChipProps = CustomVariantProps<ChipVariantsType> & {
  children: ReactNode;
  onCloseHandler?: () => void;
  pressed?: boolean;
};

const chipVariants = cva<ChipVariantsType>("", {
  variants: {
    type: {
      default: "rounded-lg border border-talearnt_Icon_03 px-[15px] py-[10px]",
      keyword: classNames(
        "flex items-center gap-1",
        "rounded-md px-2 py-[6px] bg-talearnt_BG_Up_02",
        "text-body3_14_medium text-talearnt_Text_02"
      )
    }
  },
  defaultVariants: {
    type: "default"
  }
});

function Chip({ children, onCloseHandler, pressed, type }: ChipProps) {
  return (
    <div
      className={classNames(
        chipVariants({ type }),
        pressed && "border-talearnt_Primary_01"
      )}
    >
      {type === "keyword" ? (
        <>
          <span className={"text-body3_14_medium text-talearnt_Text_02"}>
            {children}
          </span>
          {onCloseHandler && <CloseIcon onClick={onCloseHandler} size={16} />}
        </>
      ) : (
        <span
          className={classNames(
            "text-body3_14_medium text-talearnt_Text_04",
            pressed && "text-talearnt_Primary_01"
          )}
        >
          {children}
        </span>
      )}
    </div>
  );
}

export { Chip };
