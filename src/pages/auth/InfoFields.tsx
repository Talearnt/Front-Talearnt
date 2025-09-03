import { useEffect, useRef, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, ref as yupRef, string } from "yup";

import {
  postConfirmVerificationCode,
  postSendVerificationCode,
} from "@features/auth/shared/verificationCode.api";
import { classNames } from "@shared/utils/classNames";

import {
  useCheckNickname,
  useCheckUserId,
  useGetRandomNickname,
  useSignUp,
} from "@features/auth/auth.hook";
import { useDebounce } from "@shared/hooks/useDebounce";

import { useAgreementStore } from "@features/auth/signUp/signUp.store";

import { VerificationCode } from "@components/auth/VerificationCode/VerificationCode";
import { Button } from "@components/common/Button/Button";
import { Input } from "@components/common/inputs/Input/Input";
import { LabelText } from "@components/common/LabelText/LabelText";
import { Spinner } from "@components/common/Spinner/Spinner";
import { TabSlider } from "@components/common/TabSlider/TabSlider";

import {
  nameRegex,
  nicknameRegex,
  pwRegex,
  userIdRegex,
} from "@features/auth/shared/authRegex.constants";
import { genderOptions } from "@features/auth/signUp/signUp.constants";

import { verificationStateType } from "@features/auth/shared/verificationCode.type";

const infoFieldsSchema = object({
  nickname: string().matches(nicknameRegex, "match"),
  name: string().matches(
    nameRegex,
    "이름은 최소 2글자에서 최대 5글자까지, 한글만 입력 가능합니다."
  ),
  gender: string().required(),
  userId: string().matches(userIdRegex, "올바른 이메일 형식으로 입력해 주세요"),
  pw: string().matches(
    pwRegex,
    "영문, 숫자, 특수 문자를 포함한 8자 이상의 비밀번호를 입력해 주세요."
  ),
  checkedPw: string().oneOf(
    [yupRef("pw"), ""],
    "비밀번호가 일치하지 않습니다."
  ),
}).required();

function InfoFields() {
  const nickNameRef = useRef<string>("");

  const [canProceed, setCanProceed] = useState(true);
  const [verification, setVerification] = useState<verificationStateType>({
    isCodeVerified: false,
  });

  const agreements = useAgreementStore(state => state.agreements);
  const signUpMutation = useSignUp();
  const randomNicknameQuery = useGetRandomNickname();

  const {
    formState: { errors },
    register,
    setError,
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues: { gender: "남자" },
    mode: "onChange",
    resolver: yupResolver(infoFieldsSchema),
  });

  const debounceNickname = useDebounce(watch("nickname"));
  const debounceUserId = useDebounce(watch("userId"));
  const { data, isLoading } = useCheckNickname(
    debounceNickname,
    !!debounceNickname &&
      debounceNickname !== nickNameRef.current &&
      debounceNickname === watch("nickname") &&
      !errors.nickname
  );
  const { data: userIdData, isLoading: userIdIsLoading } = useCheckUserId(
    debounceUserId,
    !!debounceUserId && !errors.userId && debounceUserId === watch("userId")
  );
  const [nickname, name, gender, userId, pw, checkedPw] = watch([
    "nickname",
    "name",
    "gender",
    "userId",
    "pw",
    "checkedPw",
  ]);
  const doneButtonDisable =
    !nickname || // 닉네임 없는 경우
    !name || // 이름 없는 경우
    !userId || // 아이디 없는 경우
    !pw || // 비밀번호 없는 경우
    !checkedPw || // 확인 비밀번호 없는 경우
    pw !== checkedPw || // 비밀번호와 확인 비밀번호가 다른 경우
    (data?.data !== undefined && data.data) || // 닉네임 중복인 경우
    userIdData?.data !== false || // 아이디 중복인 경우
    Object.keys(errors).length > 0; // 그 외 에러가 있는 경우(matches 등)

  const handleSignUp = () => {
    if (!verification.phone || doneButtonDisable) {
      return;
    }

    signUpMutation.mutate({
      userId,
      pw,
      checkedPw,
      name,
      nickname,
      gender,
      phone: verification.phone,
      agreeReqDTOS: agreements.map(({ agreeCodeId, agree }) => ({
        agreeCodeId,
        agree,
      })),
    });
  };

  // 랜덤 닉네임 설정
  useEffect(() => {
    if (!canProceed || !randomNicknameQuery.data) {
      return;
    }

    const nickname = randomNicknameQuery.data.data;
    setValue("nickname", nickname);
    nickNameRef.current = nickname;
  }, [canProceed, randomNicknameQuery.data, setValue]);

  useEffect(() => {
    if (data?.data === true) {
      // 닉네임 중복인 경우
      setError("nickname", { message: "이미 등록된 닉네임입니다" });
    }
  }, [data, setError]);

  useEffect(() => {
    if (userIdData?.data === true) {
      // 아이디 중복인 경우
      setError("userId", { message: "이미 등록된 아이디입니다" });
    }
  }, [setError, userIdData]);

  return (
    <>
      <h1 className={"text-center text-heading1_30_semibold"}>
        {canProceed ? (
          <>
            마지막으로 로그인에 사용할
            <br />
            회원정보를 입력해 주세요.
          </>
        ) : (
          <>
            휴대폰 본인인증을
            <br />
            진행해 주세요.
          </>
        )}
      </h1>
      <div className={"flex flex-col gap-6"}>
        {canProceed ? (
          <>
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
                      className={
                        "text-caption1_14_medium text-talearnt_Primary_01"
                      }
                    >
                      * 한글, 영문, 숫자는 자유롭게 입력 가능하며, 특수문자는
                      #만 입력 가능해요
                    </span>
                  )}
                </>
              )}
            </div>
            <Input
              error={errors.name?.message}
              formData={{ ...register("name") }}
              label={"이름"}
              placeholder={"이름을 입력해 주세요."}
            >
              <TabSlider
                className={"ml-2 w-[160px] flex-shrink-0"}
                currentValue={gender}
                onClickHandler={value => setValue("gender", value)}
                options={genderOptions}
              />
            </Input>
            <Input
              error={errors.userId?.message}
              formData={{ ...register("userId") }}
              insideNode={
                userIdIsLoading ? (
                  <Spinner />
                ) : userIdData?.data ? (
                  <LabelText type={"error"}>사용불가</LabelText>
                ) : userIdData?.data === false ? (
                  <LabelText>사용가능</LabelText>
                ) : undefined
              }
              label={"아이디(이메일)"}
              placeholder={"이메일을 입력해 주세요"}
            />
            <Input
              error={errors.pw?.message}
              formData={{
                ...register("pw", {
                  onChange: () => trigger("checkedPw"),
                }),
              }}
              label={"비밀번호"}
              placeholder={
                "영문, 숫자, 특수문자의 조합 8자리 이상 입력해 주세요"
              }
              type={"password"}
            />
            <Input
              error={errors.checkedPw?.message}
              formData={{ ...register("checkedPw") }}
              insideNode={
                checkedPw && !errors.checkedPw ? (
                  <LabelText>확인</LabelText>
                ) : undefined
              }
              label={"비밀번호 확인"}
              placeholder={"비밀번호를 한 번 더 입력해 주세요"}
              type={"password"}
            />
            <Button
              className={"mt-[32px]"}
              disabled={doneButtonDisable || signUpMutation.isPending}
              onClick={handleSignUp}
            >
              {signUpMutation.isPending ? "처리 중..." : "가입하기"}
            </Button>
          </>
        ) : (
          <>
            <VerificationCode
              confirmCodeHandler={async ({ phone, verificationCode }) => {
                try {
                  await postConfirmVerificationCode({
                    type: "signUp",
                    phone,
                    code: verificationCode,
                  });
                  return true;
                } catch (e) {
                  if (typeof e === "object" && e !== null && "errorCode" in e) {
                    const error = e as any;
                    return error.errorCode === "400-AUTH-05"
                      ? "400-AUTH-05"
                      : error.errorMessage || "인증에 실패했습니다.";
                  }
                  return "예기치 못한 오류가 발생했습니다.";
                }
              }}
              sendCodeHandler={async phone => {
                await postSendVerificationCode({ phone, type: "signUp" });
              }}
              verificationState={[verification, setVerification]}
            />
            <Button
              className={"mt-[32px]"}
              disabled={!verification.isCodeVerified}
              onClick={() => setCanProceed(true)}
            >
              다음
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default InfoFields;
