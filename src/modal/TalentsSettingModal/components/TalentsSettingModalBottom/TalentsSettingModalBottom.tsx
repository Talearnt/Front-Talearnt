import { postTalents } from "@modal/TalentsSettingModal/core/talentsSettingModal.api";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import { useToastStore } from "@common/common.store";
import { useTalentsSettingModalStore } from "@modal/TalentsSettingModal/core/talentsSettingModal.store";

import { Button } from "@components/Button/Button";
import { ModalBottom } from "@components/modal/ModalBottom/ModalBottom";
import { Spinner } from "@components/Spinner/Spinner";

import { talentsType } from "@modal/TalentsSettingModal/core/talentsSettingModal.type";

function TalentsSettingModalBottom() {
  const {
    scrollRef,
    currentTalentsType,
    talentsData,
    setCurrentTalentsType,
    setStatus,
    isLoading,
    isSuccess
  } = useTalentsSettingModalStore();
  const { setToast } = useToastStore();

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
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }, 0);
    setInterval(
      () => console.log(scrollRef.current, scrollRef.current?.scrollTop),
      1000
    );
    // 스크롤 최상단으로 이동
    setCurrentTalentsType(type);
  };

  // 재능 설정
  const handleConfirm = async () => {
    if (isLoading) {
      return;
    }

    setStatus("loading");

    try {
      await postTalents({
        giveTalents: talentsData.giveTalents.map(({ value }) => value),
        receiveTalents: talentsData.receiveTalents.map(({ value }) => value)
      });
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
