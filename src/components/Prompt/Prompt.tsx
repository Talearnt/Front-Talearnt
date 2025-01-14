import { classNames } from "@utils/classNames";

import { usePromptStore } from "@common/common.store";

import { Button } from "@components/Button/Button";
import { ModalContainer } from "@components/modal/ModalContainer/ModalContainer";

function Prompt() {
  const promptData = usePromptStore(state => state.promptData);
  const setPrompt = usePromptStore(state => state.setPrompt);

  if (promptData === undefined) {
    return null;
  }

  return (
    <ModalContainer className={"items-start"}>
      <div
        className={classNames(
          "flex flex-col",
          "mt-[120px] h-fit w-[440px] rounded-xl bg-talearnt-BG_Background p-6"
        )}
      >
        <h1 className={classNames("text-base font-semibold")}>
          {promptData.title}
        </h1>
        <p
          className={classNames(
            "mt-2",
            "whitespace-pre-line text-sm font-medium"
          )}
        >
          {promptData.content}
        </p>
        <div className={classNames("flex justify-end gap-4", "mt-4")}>
          {promptData.cancelOnClickHandler && (
            <Button
              buttonStyle={"outlined-blue"}
              className={"h-[40px] w-[95px]"}
              onClick={() => {
                promptData.cancelOnClickHandler?.();
                setPrompt();
              }}
            >
              취소
            </Button>
          )}
          <Button
            className={"h-[40px] w-[95px]"}
            onClick={promptData.confirmOnClickHandler ?? (() => setPrompt())}
          >
            확인
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}

export { Prompt };
