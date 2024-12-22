import { classNames } from "@utils/classNames";

import { useLockBodyScroll } from "@hook/useLockBodyScroll";

import { usePromptStore } from "@common/common.store";

import { Button } from "@components/Button/Button";

function Prompt() {
  const { promptData } = usePromptStore();

  useLockBodyScroll();

  if (promptData === undefined) {
    return null;
  }

  return (
    <div
      className={classNames(
        "fixed left-0 top-0 flex justify-center",
        "h-full w-full bg-black/30"
      )}
    >
      <div
        className={classNames(
          "flex flex-col",
          "mt-[120px] h-fit w-[440px] rounded-xl bg-talearnt-BG_Background p-6"
        )}
      >
        <h1 className={classNames("text-base font-semibold")}>
          {promptData.title}
        </h1>
        <p className={classNames("mt-2", "text-lg font-medium")}>
          {promptData.content}
        </p>
        <div className={classNames("flex justify-end gap-4", "mt-4")}>
          {promptData.cancelOnClickHandler && (
            <Button
              buttonStyle={"outlined-blue"}
              className={"h-[40px] w-[95px]"}
              onClick={promptData.cancelOnClickHandler}
            >
              취소
            </Button>
          )}
          <Button
            className={"h-[40px] w-[95px]"}
            onClick={promptData.confirmOnClickHandler}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Prompt };
