import { classNames } from "@shared/utils/classNames";

function SkeletonMatchingArticleCard() {
  return (
    <div
      className={classNames(
        "flex flex-col",
        "animate-pulse rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]",
        "cursor-pointer"
      )}
    >
      <div className={classNames("flex items-center gap-2", "mb-6")}>
        <div className="h-10 w-10 rounded-full bg-talearnt_Icon_04" />
        <div className="h-6 w-[100px] rounded-sm bg-talearnt_Icon_04" />
      </div>
      <div className="mb-2 h-6 w-[150px] rounded-sm bg-talearnt_Icon_04" />
      <div className="mb-2 h-[58px] w-full rounded-sm bg-talearnt_Icon_04" />
      <div className="mb-[60px] h-5 w-[200px] rounded-sm bg-talearnt_Icon_04" />
      <div className="mb-4 h-[30px] w-[200px] rounded-sm bg-talearnt_Icon_04" />
      <div className="mb-6 h-px w-full bg-talearnt_Line_01" />
      <div className="mb-2 h-[18px] w-[70px] rounded-sm bg-talearnt_Icon_04" />
    </div>
  );
}

export { SkeletonMatchingArticleCard };
