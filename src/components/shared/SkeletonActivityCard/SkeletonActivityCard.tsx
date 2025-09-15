import { classNames } from "@shared/utils/classNames";

function SkeletonActivityCard() {
  return (
    <div
      className={classNames(
        "flex flex-col gap-[14px]",
        "animate-pulse rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-5 w-[80px] rounded-sm bg-talearnt_Icon_04" />
        <div className="h-6 w-6 rounded bg-talearnt_Icon_04" />
      </div>
      <div className="h-8 w-[60px] rounded-sm bg-talearnt_Icon_04" />
    </div>
  );
}

export { SkeletonActivityCard };
