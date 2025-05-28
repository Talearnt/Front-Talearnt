import { ModalBox } from "@components/common/modal/parts/ModalBox";
import { ModalContainer } from "@components/common/modal/parts/ModalContainer";
import { TalentsSettingModalBody } from "@components/layout/TalentsSettingModal/TalentsSettingModalBody/TalentsSettingModalBody";
import { TalentsSettingModalBottom } from "@components/layout/TalentsSettingModal/TalentsSettingModalBottom/TalentsSettingModalBottom";
import { TalentsSettingModalHeader } from "@components/layout/TalentsSettingModal/TalentsSettingModalHeader/TalentsSettingModalHeader";

function TalentsSettingModal() {
  return (
    <ModalContainer>
      <ModalBox className={"w-[600px]"}>
        <TalentsSettingModalHeader />
        <TalentsSettingModalBody />
        <TalentsSettingModalBottom />
      </ModalBox>
    </ModalContainer>
  );
}

export { TalentsSettingModal };
