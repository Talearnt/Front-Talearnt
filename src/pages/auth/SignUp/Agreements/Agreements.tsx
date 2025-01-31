import { useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { useAgreementStore } from "@pages/auth/auth.store";

import { Button } from "@components/Button/Button";
import { CheckBox } from "@components/CheckBox/CheckBox";

function Agreements() {
  const navigator = useNavigate();

  const agreements = useAgreementStore(state => state.agreements);
  const isAllAgreementsAgreed = useAgreementStore(
    state => state.isAllAgreementsAgreed
  );
  const isRequiredAgreementsAgreed = useAgreementStore(
    state => state.isRequiredAgreementsAgreed
  );
  const setAgreement = useAgreementStore(state => state.setAgreement);
  const setAllAgreement = useAgreementStore(state => state.setAllAgreement);

  return (
    <>
      <h1 className={classNames("text-center text-3xl font-semibold")}>
        Talearnt 서비스 이용을 위한
        <br /> 약관에 동의해 주세요
      </h1>
      <div className={"flex flex-col"}>
        <CheckBox
          className={classNames(
            "gap-4",
            "border-b border-b-talearnt-Line_01",
            "h-[71px]"
          )}
          checked={isAllAgreementsAgreed()}
          onChange={({ target }) => setAllAgreement(target.checked)}
        >
          <p className={"w-full text-lg font-semibold"}>
            전체 동의하기 (선택 정보를 포함합니다.)
          </p>
        </CheckBox>
        {agreements.map(({ agreeCodeId, agree, required, title }) => (
          <CheckBox
            className={classNames(
              "gap-4",
              "border-b border-b-talearnt-Line_01",
              "h-[71px]"
            )}
            checked={agree}
            onChange={({ target }) => setAgreement(agreeCodeId, target.checked)}
            key={agreeCodeId}
          >
            <p className={"w-full text-base font-semibold"}>
              {required ? (
                <span className={"text-talearnt-Error_01"}>(필수)</span>
              ) : (
                "(선택)"
              )}
              &nbsp;
              {title}
            </p>
          </CheckBox>
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
