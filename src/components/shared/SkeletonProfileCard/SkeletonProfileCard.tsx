import { classNames } from "@shared/utils/classNames";

function SkeletonProfileCard() {
  return (
    <div
      className={classNames(
        "flex flex-col gap-6",
        "animate-pulse rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-[100px] w-[100px] rounded-full bg-talearnt_Icon_04" />
        <div className="flex flex-col items-center">
          <div className="h-8 w-[100px] rounded-sm bg-talearnt_Icon_04" />
          <div className="h-6 w-[190px] rounded-sm bg-talearnt_Icon_04" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-6 w-[100px] rounded-sm bg-talearnt_Icon_04" />
        <div className="flex gap-3">
          <div className="h-[30px] w-16 rounded-md bg-talearnt_Icon_04" />
          <div className="h-[30px] w-20 rounded-md bg-talearnt_Icon_04" />
          <div className="h-[30px] w-14 rounded-md bg-talearnt_Icon_04" />
        </div>
      </div>
      <div className="h-px w-full bg-talearnt_Line_01" />
      <div className="flex flex-col gap-2">
        <div className="h-6 w-[100px] rounded-sm bg-talearnt_Icon_04" />
        <div className="flex gap-3">
          <div className="h-[30px] w-16 rounded-md bg-talearnt_Icon_04" />
          <div className="h-[30px] w-20 rounded-md bg-talearnt_Icon_04" />
          <div className="h-[30px] w-14 rounded-md bg-talearnt_Icon_04" />
        </div>
      </div>
    </div>
  );
}

export { SkeletonProfileCard };
