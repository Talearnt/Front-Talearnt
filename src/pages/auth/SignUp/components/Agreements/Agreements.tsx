import { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { CheckBox } from "@components/CheckBox/CheckBox";

type agreementsDataType = {
  required: boolean;
  title: string;
}[];

const agreementsData: agreementsDataType = [
  {
    required: true,
    title: "이용약관 동의"
  },
  {
    required: true,
    title: "개인정보 수집"
  },
  {
    required: false,
    title: "마케팅 목적의 개인정보 수집 및 이용 동의"
  },
  {
    required: false,
    title: "광고성 정보 수신 동의"
  }
];

function Agreements() {
  const navigator = useNavigate();

  const { register, setValue, watch } = useForm();

  const [agreement1, agreement2] = watch(["agreement1", "agreement2"]);

  const handleAllCheckboxChange = ({
    target
  }: ChangeEvent<HTMLInputElement>) => {
    const isChecked = target.checked;

    setValue("all", isChecked);
    agreementsData.forEach((_, index) =>
      setValue(`agreement${(index + 1).toString()}`, isChecked)
    );
  };

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
          formData={{ ...register("all") }}
          onChange={handleAllCheckboxChange}
        >
          <p className={"w-full text-lg font-semibold"}>
            전체 동의하기 (선택 정보를 포함합니다.)
          </p>
        </CheckBox>
        {agreementsData.map(({ required, title }, index) => (
          <CheckBox
            className={classNames(
              "gap-4",
              "border-b border-b-talearnt-Line_01",
              "h-[71px]"
            )}
            formData={{ ...register(`agreement${(index + 1).toString()}`) }}
            key={`agreement${(index + 1).toString()}`}
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
        disabled={!agreement1 || !agreement2}
        onClick={() => navigator("/sign-up/user-info")}
      >
        시작하기
      </Button>
    </>
  );
}

export default Agreements;
