import { ChangeEvent, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { getRandomNickName, postKakaoSignUp } from "@pages/auth/api/auth.api";

import { classNames } from "@utils/classNames";

import useDebounce from "@hook/useDebounce";
import { useCheckNickname } from "@pages/auth/api/auth.hook";

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

const kakaoExtraInfoSchema = object({
  nickname: string().matches(nicknameRegex, "match")
}).required();

function KakaoExtraInfo() {
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
    resolver: yupResolver(kakaoExtraInfoSchema)
  });
  const agreementsForm = useForm();

  const { agreements: agreementsList } = useAgreementStore();
  const { kakaoAuthResponse } = useKakaoAuthResponseStore();
  const debounceNickname = useDebounce(watch("nickname"));
  const { data, isLoading } = useCheckNickname(
    debounceNickname,
    !!debounceNickname &&
      debounceNickname !== nickNameRef.current &&
      !errors.nickname
  );

  const agreements = agreementsForm.watch(
    agreementsList.map(({ agreeCodeId }) => agreeCodeId.toString())
  );
  const [nickname] = watch(["nickname"]);
  const buttonIsDisabled =
    agreements[0] === false || // 필수 이용약관 동의 안 한 경우
    agreements[1] === false || // 필수 이용약관 동의 안 한 경우
    !nickname || // 닉네임 없는 경우
    data?.data !== false; // 닉네임 중복인 경우

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
        agreeReqDTOS: agreementsList.map(({ agreeCodeId }, index) => ({
          agreeCodeId,
          agree: agreements[index]
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
        const nickname = data;

        setValue("nickname", nickname);
        nickNameRef.current = nickname;
      })
      .catch(() => setValue("nickname", ""));
  }, [setValue]);

  useEffect(() => {
    if (data?.data === true) {
      // 닉네임 중복인 경우
      setError("nickname", { message: "이미 등록된 닉네임입니다" });
    }
  }, [data, setError]);

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
              isLoading ? (
                <Spinner />
              ) : data?.data ? (
                <LabelText type={"error"}>사용불가</LabelText>
              ) : data?.data === false ? (
                <LabelText>사용가능</LabelText>
              ) : undefined
            }
            label={"닉네임"}
            placeholder={"닉네임을 입력해 주세요"}
          />
          {data?.data !== true && (
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

export default KakaoExtraInfo;
