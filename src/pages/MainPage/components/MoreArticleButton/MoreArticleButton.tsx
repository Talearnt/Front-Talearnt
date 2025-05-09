import { ComponentProps } from "react";

import { classNames } from "@utils/classNames";

import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";

type MoreArticleButtonProps = Pick<ComponentProps<"button">, "onClick"> & {
  type: "community" | "matching";
};

function MoreArticleButton({ onClick, type }: MoreArticleButtonProps) {
  return (
    <button
      className={classNames(
        "flex items-center gap-4",
        "mx-auto h-[50px] w-fit rounded-full bg-talearnt_BG_Up_01 px-4"
      )}
      onClick={onClick}
    >
      <span className={"text-body2_16_semibold text-talearnt_Text_Strong"}>
        {type === "community" ? "커뮤니티" : "매칭"} 게시물 더 보기
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

export { MoreArticleButton };
