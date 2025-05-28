import { useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";

import { useAgreementStore } from "@features/auth/signUp/signUp.store";

import { Button } from "@components/common/Button/Button";
import { Checkbox } from "@components/common/Checkbox/Checkbox";

function Agreements() {
  const navigator = useNavigate();

  const {
    agreements,
    isAllAgreementsAgreed,
    isRequiredAgreementsAgreed,
    setAllAgreement,
    setAgreement
  } = useAgreementStore(
    useShallow(state => ({
      agreements: state.agreements,
      isAllAgreementsAgreed: state.isAllAgreementsAgreed,
      isRequiredAgreementsAgreed: state.isRequiredAgreementsAgreed,
      setAllAgreement: state.setAllAgreement,
      setAgreement: state.setAgreement
    }))
  );

  return (
    <>
      <h1 className={"text-center text-heading1_30_semibold"}>
        Talearnt 서비스 이용을 위한
        <br /> 약관에 동의해 주세요
      </h1>
      <div className={"flex flex-col"}>
        <Checkbox
          className={classNames(
            "gap-4",
            "h-[72px] border-b border-b-talearnt_Line_01"
          )}
          checked={isAllAgreementsAgreed()}
          onChange={({ target }) => setAllAgreement(target.checked)}
        >
          <span className={"text-body1_18_semibold1 w-full"}>
            전체 동의하기 (선택 정보를 포함합니다.)
          </span>
        </Checkbox>
        {agreements.map(({ agreeCodeId, agree, required, title }) => (
          <Checkbox
            className={classNames(
              "gap-4",
              "h-[72px] border-b border-b-talearnt_Line_01"
            )}
            checked={agree}
            onChange={({ target }) => setAgreement(agreeCodeId, target.checked)}
            key={agreeCodeId}
          >
            <p className={"w-full text-body2_16_semibold"}>
              {required ? (
                <span className={"text-talearnt_Error_01"}>(필수)</span>
              ) : (
                "(선택)"
              )}
              &nbsp;
              {title}
            </p>
          </Checkbox>
        ))}
      </div>
      <Button
        disabled={!isRequiredAgreementsAgreed()}
        onClick={() => navigator("/sign-up/info-fields")}
      >
        시작하기
      </Button>
    </>
  );
}

export default Agreements;
