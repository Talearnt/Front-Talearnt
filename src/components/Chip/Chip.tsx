import { MouseEvent, ReactNode } from "react";

import { cva } from "class-variance-authority";

import { classNames } from "@utils/classNames";

import { CloseIcon } from "@components/icons/CloseIcon/CloseIcon";

import { CustomVariantProps } from "@common/common.type";

type ChipVariantsType = {
  type: Record<"default-small" | "default-large" | "keyword", string>;
};

type ChipProps = CustomVariantProps<ChipVariantsType> & {
  children: ReactNode;
  onClickHandler?: (e: MouseEvent<HTMLDivElement>) => void;
  onCloseHandler?: (e: MouseEvent<SVGSVGElement>) => void;
  pressed?: boolean;
};

const chipVariants = cva<ChipVariantsType>(
  "flex justify-center items-center px-[15px] border border-talearnt_Icon_03 rounded-lg cursor-pointer",
  {
    variants: {
      type: {
        "default-small": "h-10 ",
        "default-large": "h-[50px]",
        keyword: classNames(
          "gap-1",
          "rounded-md px-2 py-[6px] bg-talearnt_BG_Up_02 border-none cursor-default",
          "text-body3_14_medium text-talearnt_Text_02"
        )
      }
    },
    defaultVariants: {
      type: "default-small"
    }
  }
);

function Chip({
  children,
  onClickHandler,
  onCloseHandler,
  pressed,
  type
}: ChipProps) {
  return (
    <div
      className={classNames(
        chipVariants({ type }),
        pressed && "border-talearnt_Primary_01"
      )}
      onClick={onClickHandler}
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
            "text-talearnt_Text_04",
            type === "default-small" && "text-body3_14_medium",
            type === "default-large" && "text-body2_16_medium",
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
