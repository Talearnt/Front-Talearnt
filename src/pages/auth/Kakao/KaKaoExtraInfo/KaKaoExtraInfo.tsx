import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import {
  getCheckNickName,
  getRandomNickName,
  postKakaoSignUp
} from "@pages/auth/api/auth.api";

import { classNames } from "@utils/classNames";

import useDebounce from "@hook/useDebounce";

import {
  useAgreementStore,
  useKakaoAuthResponseStore
} from "@pages/auth/api/auth.store";

import { Button } from "@components/Button/Button";
import { CheckBox } from "@components/CheckBox/CheckBox";
import { Input } from "@components/Input/Input";
import { LabelText } from "@components/LabelText/LabelText";
import { Spinner } from "@components/Spinner/Spinner";
import { TabSlider } from "@components/TabSlider/TabSlider";

import {
  genderOptions,
  nicknameRegex
} from "@pages/auth/common/common.constants";

const kaKaoExtraInfoSchema = object({
  nickname: string().matches(nicknameRegex, "match")
}).required();

function KaKaoExtraInfo() {
  const navigator = useNavigate();
  const nickNameRef = useRef<string>("");

  const {
    formState: { errors },
    register,
    setError,
    setValue,
    watch
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(kaKaoExtraInfoSchema)
  });
  const agreementsForm = useForm();

  const { agreements: agreementsList } = useAgreementStore();
  const { kakaoAuthResponse } = useKakaoAuthResponseStore();

  const [isNickNameDuplicate, setIsNickNameDuplicate] = useState<
    boolean | "loading"
  >();

  const agreements = agreementsForm.watch(
    agreementsList.map(({ agreeCodeId }) => agreeCodeId.toString())
  );
  const [nickname] = watch(["nickname"]);
  const buttonIsDisabled =
    agreements[0] === false ||
    agreements[1] === false ||
    !nickname ||
    isNickNameDuplicate !== false;
  const debounceNickName = useDebounce(nickname);

  const handleAllCheckboxChange = ({
    target
  }: ChangeEvent<HTMLInputElement>) => {
    const isChecked = target.checked;

    agreementsForm.setValue("all", isChecked);
    agreementsList.forEach(({ agreeCodeId }) =>
      agreementsForm.setValue(agreeCodeId.toString(), isChecked)
    );
  };

  const handleSignUp = async () => {
    if (buttonIsDisabled || kakaoAuthResponse === null) {
      return;
    }

    try {
      await postKakaoSignUp({
        ...kakaoAuthResponse,
        nickname,
        agreeReqDTOS: agreements.map(({ agreeCodeId, agree }) => ({
          agreeCodeId,
          agree
        }))
      });

      navigator("/kakao/complete");
    } catch (e) {
      // TODO 토스트 alert 적용
      console.log(e);
    }
  };

  useEffect(() => {
    // nickName 인풋에 random nickname 적용
    getRandomNickName()
      .then(({ data }) => {
        const nickname = data as string;

        setValue("nickname", nickname);
        nickNameRef.current = nickname;
      })
      .catch(() => setValue("nickname", ""));
  }, [setValue]);

  useEffect(() => {
    if (errors.nickname) {
      return;
    }

    const checkEmailValidity = async () => {
      if (
        nickname === nickNameRef.current ||
        nickname !== debounceNickName ||
        !debounceNickName
      ) {
        // 랜덤 생성된 닉네임과 동일하거나, 닉네임이 없거나, 디바운스중 일경우
        setIsNickNameDuplicate(undefined);
        return;
      }

      setIsNickNameDuplicate("loading");

      try {
        // TODO tanstack-query 적용해서 캐싱
        const { data } = await getCheckNickName(debounceNickName);
        setIsNickNameDuplicate(data as boolean);

        if (data) {
          setError("nickname", { message: "이미 등록된 닉네임입니다" });
        }
      } catch {
        setIsNickNameDuplicate(undefined);
      }
    };

    void checkEmailValidity();
  }, [debounceNickName, errors.nickname, nickname, setError]);

  if (kakaoAuthResponse === null) {
    return;
  }

  return (
    <>
      <h1 className={"text-center text-3xl font-semibold"}>
        로그인에 사용할
        <br />
        회원정보와 약관에 동의해 주세요.
      </h1>
      <div className={"flex flex-col gap-6"}>
        <Input disabled label={"이름"} value={kakaoAuthResponse.name}>
          <TabSlider
            className={classNames("ml-2 flex-shrink-0", "w-[160px]")}
            currentValue={kakaoAuthResponse.gender}
            disabled
            options={genderOptions}
          />
        </Input>
        <Input
          disabled
          label={"아이디(이메일)"}
          value={kakaoAuthResponse.userId}
        />
        <Input disabled label={"휴대폰 번호"} value={kakaoAuthResponse.phone} />
        <div className={"flex flex-col"}>
          <Input
            error={
              errors.nickname?.message === "match"
                ? ""
                : errors.nickname?.message
            }
            formData={{ ...register("nickname") }}
            insideNode={
              isNickNameDuplicate ===
              undefined ? undefined : isNickNameDuplicate === "loading" ? (
                <Spinner />
              ) : isNickNameDuplicate ? (
                <LabelText type={"error"}>사용불가</LabelText>
              ) : (
                <LabelText>사용가능</LabelText>
              )
            }
            label={"닉네임"}
            placeholder={"닉네임을 입력해 주세요"}
          />
          {isNickNameDuplicate !== true && (
            <>
              <span
                className={classNames(
                  "mt-1",
                  "text-sm font-medium text-talearnt-Text_03"
                )}
              >
                *&nbsp;
                {nickname === nickNameRef.current
                  ? "랜덤으로 지정된 닉네임입니다. 자유롭게 수정 가능해요"
                  : "2~12자 이내로 입력해 주세요"}
              </span>
              {nickname !== nickNameRef.current && (
                <span
                  className={"text-sm font-medium text-talearnt-Primary_01"}
                >
                  * 한글, 영문, 숫자는 자유롭게 입력 가능하며, 특수문자는 #만
                  입력 가능해요
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <div className={"flex flex-col"}>
        <CheckBox
          className={classNames(
            "gap-4",
            "border-b border-b-talearnt-Line_01",
            "h-[71px]"
          )}
          formData={{ ...agreementsForm.register("all") }}
          onChange={handleAllCheckboxChange}
        >
          <p className={"w-full text-lg font-semibold"}>
            전체 동의하기 (선택 정보를 포함합니다.)
          </p>
        </CheckBox>
        {agreementsList.map(({ agreeCodeId, required, title }) => (
          <CheckBox
            className={classNames(
              "gap-4",
              "border-b border-b-talearnt-Line_01",
              "h-[71px]"
            )}
            formData={{
              ...agreementsForm.register(agreeCodeId.toString())
            }}
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
      <Button disabled={buttonIsDisabled} onClick={handleSignUp}>
        가입하기
      </Button>
    </>
  );
}

export default KaKaoExtraInfo;
