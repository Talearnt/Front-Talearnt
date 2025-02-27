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
          "mt-[120px] h-fit w-[440px] rounded-xl bg-talearnt_BG_Background p-6 shadow-shadow_03"
        )}
      >
        <h1 className={"text-body2_16_semibold"}>{promptData.title}</h1>
        <p
          className={classNames(
            "mt-2",
            "whitespace-pre-line text-body3_14_medium"
          )}
        >
          {promptData.content}
        </p>
        <div className={classNames("flex justify-end gap-4", "mt-4")}>
          {promptData.cancelOnClickHandler && (
            <Button
              buttonStyle={"outlined-blue"}
              size={"small"}
              onClick={promptData.cancelOnClickHandler}
            >
              취소
            </Button>
          )}
          <Button
            size={"small"}
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
