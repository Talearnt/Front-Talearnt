import { useTalentsSettingModalStore } from "@modal/TalentsSettingModal/core/talentsSettingModal.store";

import { ModalHeader } from "@components/modal/ModalHeader/ModalHeader";

import { CURRENT_TALENTS_TYPE_NAME } from "@modal/TalentsSettingModal/core/talentsList.constants";

function TalentsSettingModalHeader() {
  const currentTalentsType = useTalentsSettingModalStore(
    state => state.currentTalentsType
  );
  const isSuccess = useTalentsSettingModalStore(state => state.isSuccess);

  return (
    <ModalHeader>
      <div className={"flex flex-col items-center gap-1"}>
        <h1 className={"text-heading3_22_semibold text-talearnt_Text_Strong"}>
          {isSuccess
            ? "맞춤 키워드 등록이 완료되었습니다."
            : `${CURRENT_TALENTS_TYPE_NAME[currentTalentsType]} 키워드를 선택해 주세요!`}
        </h1>
        <h2 className={"text-body3_14_medium text-talearnt_Text_03"}>
          {isSuccess
            ? "이제 서로의 재능들을 교환해 보세요!"
            : "(최대 5개까지 선택 가능해요)"}
        </h2>
      </div>
    </ModalHeader>
  );
}

export { TalentsSettingModalHeader };
