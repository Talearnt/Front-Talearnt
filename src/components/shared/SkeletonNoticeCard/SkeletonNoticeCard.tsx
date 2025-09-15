import { classNames } from "@shared/utils/classNames";

function SkeletonNoticeCard() {
  return (
    <div
      className={classNames(
        "flex flex-col gap-2",
        "animate-pulse rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]",
        "cursor-pointer"
      )}
    >
      <div className="h-6 w-9 rounded-sm bg-talearnt_Icon_04" />
      <div className="h-[52px] w-full rounded-sm bg-talearnt_Icon_04" />
      <div className="mb-8 h-5 w-[140px] rounded-sm bg-talearnt_Icon_04" />
      <div className="h-[18px] w-[70px] rounded-sm bg-talearnt_Icon_04" />
    </div>
  );
}

export { SkeletonNoticeCard };
