import { classNames } from "@shared/utils/classNames";

import { CaretIcon } from "@components/common/icons/caret/CaretIcon";
import { DoubleCaretIcon } from "@components/common/icons/caret/DoubleCaretIcon";

type PaginationProps = {
  className?: string;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

const caretStyle = classNames(
  "p-[6px] rounded-sm bg-talearnt_BG_Background",
  "hover:bg-talearnt_BG_Up_02 hover:stroke-talearnt_Icon_01"
);

function Pagination({
  className,
  currentPage,
  totalPages,
  handlePageChange,
}: PaginationProps) {
  const currentPageRange = Math.ceil(currentPage / 5);
  const lastPageRange = Math.ceil(totalPages / 5);
  const numberOfPages =
    totalPages >= 5
      ? currentPageRange === lastPageRange // 현재 페이지 범위가 마지막 페이지 범위일 때
        ? totalPages % 5 || 5
        : 5
      : totalPages; // 전체 페이지가 5 미만일 때

  if (totalPages === 0) {
    return null;
  }

  return (
    <div
      className={classNames(
        "flex items-center justify-center gap-2",
        className
      )}
    >
      <DoubleCaretIcon
        className={classNames(caretStyle, currentPage <= 5 && "invisible")}
        onClick={() => handlePageChange(1)}
        direction={"left"}
      />
      <CaretIcon
        className={classNames(
          caretStyle,
          currentPage <= 5 && "invisible",
          "mr-4"
        )}
        onClick={() => handlePageChange((currentPageRange - 1) * 5)}
        direction={"left"}
        size={20}
      />
      {Array.from(
        {
          length: numberOfPages,
        },
        () => Math.ceil(currentPage / 5)
      ).map((pageRange, i) => {
        const page = pageRange * 5 - 4 + i;

        return (
          <button
            className={classNames(
              "h-8 w-8 rounded-sm bg-talearnt_BG_Background",
              "text-body3_14_medium text-talearnt_Text_03",
              "hover:bg-talearnt_BG_Up_02",
              "cursor-pointer",
              currentPage === page &&
                "!bg-talearnt_Primary_01 !text-talearnt_On_Primary"
            )}
            onClick={() => handlePageChange(page)}
            key={page}
          >
            {page}
          </button>
        );
      })}
      <CaretIcon
        className={classNames(
          caretStyle,
          currentPageRange === lastPageRange && "invisible",
          "ml-4"
        )}
        onClick={() => handlePageChange(currentPageRange * 5 + 1)}
        size={20}
      />
      <DoubleCaretIcon
        className={classNames(
          caretStyle,
          currentPageRange === lastPageRange && "invisible"
        )}
        onClick={() => handlePageChange(totalPages)}
      />
    </div>
  );
}

export { Pagination };
