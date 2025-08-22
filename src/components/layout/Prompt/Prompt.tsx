import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";

import { usePromptStore } from "@store/prompt.store";

import { Button } from "@components/common/Button/Button";
import { ModalContainer } from "@components/common/modal/parts/ModalContainer";

function Prompt() {
  const { promptData, setPrompt } = usePromptStore(
    useShallow(state => ({
      promptData: state.promptData,
      setPrompt: state.setPrompt,
    }))
  );

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
        onMouseDown={e => e.stopPropagation()}
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
          {!promptData.onlyConfirm && (
            <Button
              buttonStyle={"outlined-blue"}
              size={"small"}
              onClick={() => {
                promptData.cancelOnClickHandler?.();
                setPrompt();
              }}
            >
              취소
            </Button>
          )}
          <Button
            size={"small"}
            onClick={() => {
              promptData.confirmOnClickHandler?.();
              setPrompt();
            }}
          >
            확인
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}

export { Prompt };
