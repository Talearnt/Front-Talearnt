import { classNames } from "@utils/classNames";

import { useToastStore } from "@common/common.store";

function Toast() {
  const { toastList } = useToastStore();
  console.log(toastList);
  return (
    <div
      className={classNames(
        "fixed bottom-[140px] left-1/2 -translate-x-1/2 transform",
        "flex flex-col items-center gap-4"
      )}
    >
      {toastList.map(({ id, message, isRemoving }) => (
        <div
          className={classNames(
            "w-fit rounded-full bg-talearnt-BG_Black_02 px-10 py-4",
            isRemoving ? "animate-fade-out" : "animate-fade-in"
          )}
          key={id.toString()}
        >
          <span
            className={"text-base font-semibold text-talearnt-BG_Background"}
          >
            {message}
          </span>
        </div>
      ))}
    </div>
  );
}

export { Toast };
