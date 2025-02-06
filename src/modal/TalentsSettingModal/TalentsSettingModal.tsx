import { TalentsSettingModalBody } from "@modal/TalentsSettingModal/components/TalentsSettingModalBody/TalentsSettingModalBody";
import { TalentsSettingModalBottom } from "@modal/TalentsSettingModal/components/TalentsSettingModalBottom/TalentsSettingModalBottom";
import { TalentsSettingModalHeader } from "@modal/TalentsSettingModal/components/TalentsSettingModalHeader/TalentsSettingModalHeader";

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
