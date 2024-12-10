import { create } from "zustand/react";

type agreementType = {
  agreeCodeId: number;
  agree: boolean;
  required: boolean;
  title: string;
};

type agreementStoreType = {
  agreements: agreementType[];
  isAllAgreementsAgreed: () => boolean;
  isRequiredAgreementsAgreed: () => boolean;
  setAgreement: (agreeCodeId: number, agree: boolean) => void;
  setAllAgreement: (agree: boolean) => void;
};

const useAgreementStore = create<agreementStoreType>((set, get) => ({
  agreements: [
    {
      agreeCodeId: 1,
      agree: false,
      required: true,
      title: "이용약관 동의"
    },
    {
      agreeCodeId: 2,
      agree: false,
      required: true,
      title: "개인정보 수집"
    },
    {
      agreeCodeId: 3,
      agree: false,
      required: false,
      title: "마케팅 목적의 개인정보 수집 및 이용 동의"
    },
    {
      agreeCodeId: 4,
      agree: false,
      required: false,
      title: "광고성 정보 수신 동의"
    }
  ],
  isAllAgreementsAgreed: () => {
    const { agreements } = get();

    return agreements.every(item => item.agree);
  },
  isRequiredAgreementsAgreed: () => {
    const { agreements } = get();

    return agreements.every(item => !item.required || item.agree);
  },
  setAgreement: (agreeCodeId, agree) =>
    set(state => {
      const updatedAgreements = state.agreements.map(item =>
        item.agreeCodeId === agreeCodeId ? { ...item, agree } : item
      );
      return { agreements: updatedAgreements };
    }),
  setAllAgreement: agree =>
    set(state => {
      const updatedAgreements = state.agreements.map(item => ({
        ...item,
        agree
      }));

      return { agreements: updatedAgreements };
    })
}));

export default useAgreementStore;
