import { classNames } from "@shared/utils/classNames";

function Dot({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "h-1 w-1 rounded-full bg-talearnt_Text_03",
        className
      )}
    />
  );
}

export { Dot };
