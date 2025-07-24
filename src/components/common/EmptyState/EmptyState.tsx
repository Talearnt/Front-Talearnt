import { classNames } from "@shared/utils/classNames";

import { Button } from "@components/common/Button/Button";
import { MakoWithHeart } from "@components/common/icons/mako/MakoWithHeart";
import { MakoWithPencil } from "@components/common/icons/mako/MakoWithPencil";

type EmptyStateProps = {
  className?: string;
  title: string;
  description: string;
  icon?: "makoWithPencil" | "makoWithHeart";
  iconSize?: 240 | 200;
  buttonText: string;
  buttonOnClick: () => void;
  subButtonText?: string;
  subButtonOnClick?: () => void;
};

function EmptyState({
  className,
  title,
  description,
  icon = "makoWithPencil",
  iconSize = 240,
  buttonText,
  buttonOnClick,
  subButtonText,
  subButtonOnClick,
}: EmptyStateProps) {
  return (
    <div
      className={classNames(
        "flex flex-col items-center",
        "mx-auto w-fit",
        className
      )}
    >
      <p
        className={classNames(
          "mb-1",
          "text-heading2_24_semibold text-talearnt_Text_01"
        )}
      >
        {title}
      </p>
      <p
        className={classNames(
          "mb-6",
          "text-body2_16_medium text-talearnt_Text_02"
        )}
      >
        {description}
      </p>
      {icon === "makoWithPencil" && <MakoWithPencil size={iconSize} />}
      {icon === "makoWithHeart" && <MakoWithHeart size={iconSize} />}
      <div
        className={classNames(
          "flex gap-4",
          "w-[400px]",
          iconSize === 240 ? "mt-14" : "mt-6"
        )}
      >
        {subButtonText && subButtonOnClick && (
          <Button
            className={"w-full"}
            onClick={subButtonOnClick}
            buttonStyle={"outlined"}
          >
            {subButtonText}
          </Button>
        )}
        <Button className={"w-full"} onClick={buttonOnClick}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export { EmptyState };
