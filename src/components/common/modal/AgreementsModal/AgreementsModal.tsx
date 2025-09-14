import { Button } from "@components/common/Button/Button";
import { ModalBody } from "@components/common/modal/parts/ModalBody";
import { ModalBottom } from "@components/common/modal/parts/ModalBottom";
import { ModalBox } from "@components/common/modal/parts/ModalBox";
import { ModalContainer } from "@components/common/modal/parts/ModalContainer";
import { ModalHeader } from "@components/common/modal/parts/ModalHeader";
import { AdvertisingConsent } from "@components/shared/AdvertisingConsent/AdvertisingConsent";
import { MarketingConsent } from "@components/shared/MarketingConsent/MarketingConsent";
import { PrivacyPolicy } from "@components/shared/PrivacyPolicy/PrivacyPolicy";
import { TermsOfService } from "@components/shared/TermsOfService/TermsOfService";

import { agreementIdType } from "@features/auth/signUp/signUp.type";

type AgreementsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  agreementsType: agreementIdType | null;
};

export const agreementsDataMap = {
  terms: { title: "이용약관", content: <TermsOfService /> },
  privacy: { title: "개인정보처리방침", content: <PrivacyPolicy /> },
  marketing: {
    title: "마케팅 목적의 개인정보 수집 및 이용 동의",
    content: <MarketingConsent />,
  },
  advertising: {
    title: "광고성 정보 수신 동의",
    content: <AdvertisingConsent />,
  },
};

function AgreementsModal({
  isOpen,
  onClose,
  agreementsType,
}: AgreementsModalProps) {
  if (!isOpen || !agreementsType) {
    return null;
  }

  const { title, content } = agreementsDataMap[agreementsType];

  return (
    <ModalContainer>
      <ModalBox className="max-h-[80vh] w-[500px]">
        <ModalHeader onCloseHandler={onClose}>
          <h1 className="text-heading3_22_semibold text-talearnt_Text_Strong">
            {title}
          </h1>
        </ModalHeader>
        <ModalBody className="scrollbar scrollbar-w12-10 my-6 max-h-[380px] overflow-y-auto px-8">
          {content}
        </ModalBody>
        <ModalBottom className={"justify-center"}>
          <Button onClick={onClose}>확인</Button>
        </ModalBottom>
      </ModalBox>
    </ModalContainer>
  );
}

export { AgreementsModal };
