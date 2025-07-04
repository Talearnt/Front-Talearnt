import { ChangeEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

import {
  getRandomNickName,
  postKakaoSignUp,
} from "@features/auth/signUp/signUp.api";

import { checkObjectType } from "@shared/utils/checkObjectType";
import { classNames } from "@shared/utils/classNames";

import { useCheckNickname } from "@features/auth/signUp/signUp.hook";
import { useDebounce } from "@shared/hooks/useDebounce";

import {
  useAgreementStore,
  useKakaoAuthResponseStore,
} from "@features/auth/signUp/signUp.store";
import { usePromptStore } from "@store/prompt.store";
import { useToastStore } from "@store/toast.store";

import { Button } from "@components/common/Button/Button";
import { Checkbox } from "@components/common/Checkbox/Checkbox";
import { Input } from "@components/common/inputs/Input/Input";
import { LabelText } from "@components/common/LabelText/LabelText";
import { Spinner } from "@components/common/Spinner/Spinner";
import { TabSlider } from "@components/common/TabSlider/TabSlider";

import { nicknameRegex } from "@features/auth/shared/authRegex.constants";
import { genderOptions } from "@features/auth/signUp/signUp.constants";

const kakaoExtraInfoSchema = object({
  nickname: string().matches(nicknameRegex, "match"),
}).required();

function KakaoExtraInfo() {
  const navigator = useNavigate();
  const nickNameRef = useRef<string>("");

  const agreementsList = useAgreementStore(state => state.agreements);
  const kakaoAuthResponse = useKakaoAuthResponseStore(
    state => state.kakaoAuthResponse
  );
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const {
    formState: { errors },
    register,
    setError,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(kakaoExtraInfoSchema),
  });
  const agreementsForm = useForm();
  const debounceNickname = useDebounce(watch("nickname"));
  const { data, isLoading } = useCheckNickname(
    debounceNickname,
    !!debounceNickname &&
      debounceNickname !== nickNameRef.current &&
      debounceNickname === watch("nickname") &&
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
    target,
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
          agree: agreements[index],
        })),
      });

      navigator("/kakao/complete");
    } catch (e) {
      if (checkObjectType(e) && "errorMessage" in e) {
        setToast({
          message: e.errorMessage as string,
        });
        return;
      }

      setPrompt({
        title: "서버 오류",
        content:
          "알 수 없는 이유로 회원가입에 실패하였습니다.\n다시 시도해 주세요.",
      });
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
      <h1 className={"text-center text-heading1_30_semibold"}>
        로그인에 사용할
        <br />
        회원정보와 약관에 동의해 주세요.
      </h1>
      <div className={"flex flex-col gap-6"}>
        <Input disabled label={"이름"} value={kakaoAuthResponse.name}>
          <TabSlider
            className={"ml-2 w-[160px] flex-shrink-0"}
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
                  "text-caption1_14_medium text-talearnt_Text_03"
                )}
              >
                *&nbsp;
                {nickname === nickNameRef.current
                  ? "랜덤으로 지정된 닉네임입니다. 자유롭게 수정 가능해요"
                  : "2~12자 이내로 입력해 주세요"}
              </span>
              {nickname !== nickNameRef.current && (
                <span
                  className={"text-caption1_14_medium text-talearnt_Primary_01"}
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
        <Checkbox
          className={classNames(
            "gap-4",
            "h-[72px] border-b border-b-talearnt_Line_01"
          )}
          formData={{
            ...agreementsForm.register("all", {
              onChange: handleAllCheckboxChange,
            }),
          }}
        >
          <span className={"w-full text-body1_18_semibold"}>
            전체 동의하기 (선택 정보를 포함합니다.)
          </span>
        </Checkbox>
        {agreementsList.map(({ agreeCodeId, required, title }) => (
          <Checkbox
            className={classNames(
              "gap-4",
              "h-[72px] border-b border-b-talearnt_Line_01"
            )}
            formData={{
              ...agreementsForm.register(agreeCodeId.toString()),
            }}
            key={agreeCodeId}
          >
            <span className={classNames("w-full", "text-body2_16_semibold")}>
              {required ? (
                <span className={"text-talearnt_Error_01"}>(필수)</span>
              ) : (
                "(선택)"
              )}
              &nbsp;
              {title}
            </span>
          </Checkbox>
        ))}
      </div>
      <Button disabled={buttonIsDisabled} onClick={handleSignUp}>
        가입하기
      </Button>
    </>
  );
}

export default KakaoExtraInfo;
