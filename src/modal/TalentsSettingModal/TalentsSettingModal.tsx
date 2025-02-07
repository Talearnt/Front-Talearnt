import { TalentsSettingModalBody } from "@modal/TalentsSettingModal/TalentsSettingModalBody/TalentsSettingModalBody";
import { TalentsSettingModalBottom } from "@modal/TalentsSettingModal/TalentsSettingModalBottom/TalentsSettingModalBottom";
import { TalentsSettingModalHeader } from "@modal/TalentsSettingModal/TalentsSettingModalHeader/TalentsSettingModalHeader";

import { ModalBox } from "@components/modal/ModalBox/ModalBox";
import { ModalContainer } from "@components/modal/ModalContainer/ModalContainer";

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
