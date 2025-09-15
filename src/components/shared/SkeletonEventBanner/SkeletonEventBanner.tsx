import { classNames } from "@shared/utils/classNames";

function SkeletonEventBanner() {
  return (
    <div
      className={classNames(
        "flex flex-col gap-2",
        "animate-pulse",
        "cursor-pointer"
      )}
    >
      <div className="h-[222px] w-full rounded-sm bg-talearnt_Icon_04" />
      <div className="flex justify-between">
        <div className="h-[18px] w-10 rounded-sm bg-talearnt_Icon_04" />
        <div className="h-[18px] w-[160px] rounded-sm bg-talearnt_Icon_04" />
      </div>
    </div>
  );
}

export { SkeletonEventBanner };
