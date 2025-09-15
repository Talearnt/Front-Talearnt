import { classNames } from "@shared/utils/classNames";

function SkeletonCommentCard() {
  return (
    <div
      className={classNames(
        "flex flex-col gap-4",
        "animate-pulse rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="h-6 w-16 rounded-sm bg-talearnt_Icon_04" />
        <div className="h-4 w-[200px] rounded-sm bg-talearnt_Icon_04" />
        <div className="h-4 w-[80px] rounded-sm bg-talearnt_Icon_04" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-full rounded-sm bg-talearnt_Icon_04" />
        <div className="h-5 w-[80%] rounded-sm bg-talearnt_Icon_04" />
        <div className="h-5 w-[60%] rounded-sm bg-talearnt_Icon_04" />
      </div>
      <div className="h-4 w-[120px] rounded-sm bg-talearnt_Icon_04" />
    </div>
  );
}

export { SkeletonCommentCard };
