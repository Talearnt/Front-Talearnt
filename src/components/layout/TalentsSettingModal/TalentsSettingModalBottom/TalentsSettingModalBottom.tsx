import { useShallow } from "zustand/shallow";

import { postTalents } from "@features/talentsSettingModal/talentsSettingModal.api";

import { checkObjectType } from "@shared/utils/checkObjectType";
import { classNames } from "@shared/utils/classNames";

import { useTalentsSettingModalStore } from "@features/talentsSettingModal/talentsSettingModal.store";
import { useToastStore } from "@store/toast.store";

import { Button } from "@components/common/Button/Button";
import { ModalBottom } from "@components/common/modal/parts/ModalBottom";
import { Spinner } from "@components/common/Spinner/Spinner";

import { talentsType } from "@features/talentsSettingModal/talentsSettingModal.type";

function TalentsSettingModalBottom() {
  const {
    scrollRef,
    currentTalentsType,
    talentsData,
    isSuccess,
    isLoading,
    setCurrentTalentsType,
    setStatus
  } = useTalentsSettingModalStore(
    useShallow(state => ({
      scrollRef: state.scrollRef,
      currentTalentsType: state.currentTalentsType,
      talentsData: state.talentsData,
      isSuccess: state.isSuccess,
      isLoading: state.isLoading,
      setCurrentTalentsType: state.setCurrentTalentsType,
      setStatus: state.setStatus
    }))
  );
  const setToast = useToastStore(state => state.setToast);

  // 다음/이전 누를 때 드롭다운 닫힘 처리, 스크롤 최상단 이동
  const handleTypeChange = (type: talentsType) => {
    if (!scrollRef.current) {
      return;
    }

    // scrollRef 아래 있는 드롭다운 inputs
    const inputs = scrollRef.current.querySelectorAll('input[type="checkbox"]');

    // 모두 닫힘 처리
    inputs.forEach(input => {
      (input as HTMLInputElement).checked = false;
    });
    // 스크롤 최상단으로 이동
    scrollRef.current.scrollTo({ top: 0 });
    setCurrentTalentsType(type);
  };

  // 재능 설정
  const handleConfirm = async () => {
    if (isLoading) {
      return;
    }

    setStatus("loading");

    try {
      await postTalents(talentsData);
      setStatus("success");
    } catch (e) {
      setStatus("default");
      if (checkObjectType(e) && "errorCode" in e) {
        setToast({
          message: e.errorMessage as string,
          type: "error"
        });
        return;
      }

      setToast({
        message: "예기치 못한 오류가 발생했습니다.",
        type: "error"
      });
    }
  };

  return (
    <ModalBottom>
      <div className={classNames("flex justify-between", "w-full px-[30px]")}>
        {isSuccess ? (
          <Button className={"w-full"}>매칭 게시물 보러 가기</Button>
        ) : (
          <>
            {currentTalentsType === "giveTalents" && (
              <Button
                className={"ml-auto w-[95px]"}
                disabled={talentsData.giveTalents.length === 0}
                onClick={() => handleTypeChange("receiveTalents")}
              >
                다음
              </Button>
            )}
            {currentTalentsType === "receiveTalents" && (
              <>
                <Button
                  buttonStyle={"outlined"}
                  className={"w-[95px]"}
                  onClick={() => handleTypeChange("giveTalents")}
                >
                  이전
                </Button>
                <Button
                  className={"w-[95px]"}
                  disabled={talentsData.receiveTalents.length === 0}
                  onClick={handleConfirm}
                >
                  {isLoading ? <Spinner /> : "완료"}
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </ModalBottom>
  );
}

export { TalentsSettingModalBottom };
