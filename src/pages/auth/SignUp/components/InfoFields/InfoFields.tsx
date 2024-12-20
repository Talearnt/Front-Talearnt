import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, ref as yupRef, string } from "yup";

import {
  getCheckNickName,
  getCheckUserId,
  getRandomNickName,
  postConfirmVerificationCode,
  postSendVerificationCode,
  postSignUp
} from "@pages/auth/api/auth.api";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import useDebounce from "@hook/useDebounce";

import { useAgreementStore } from "@pages/auth/api/auth.store";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { LabelText } from "@components/LabelText/LabelText";
import { Spinner } from "@components/Spinner/Spinner";
import { TabSlider } from "@components/TabSlider/TabSlider";
import { VerificationCode } from "@pages/auth/components/VerificationCode/VerificationCode";

import {
  genderOptions,
  nameRegex,
  nicknameRegex,
  pwRegex,
  userIdRegex
} from "@pages/auth/common/common.constants";

import { verificationStateType } from "@pages/auth/api/auth.type";

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
  checkedPw: string().oneOf([yupRef("pw"), ""], "비밀번호가 일치하지 않습니다.")
}).required();

function InfoFields() {
  const nickNameRef = useRef<string>("");
  const navigator = useNavigate();

  const {
    formState: { errors },
    register,
    setError,
    setValue,
    trigger,
    watch
  } = useForm({
    defaultValues: { gender: "남자" },
    mode: "onChange",
    resolver: yupResolver(infoFieldsSchema)
  });
  const { agreements } = useAgreementStore();

  const [canProceed, setCanProceed] = useState(false);
  const [verification, setVerification] = useState<verificationStateType>({
    isCodeVerified: false
  });
  const [isNickNameDuplicate, setIsNickNameDuplicate] = useState<
    boolean | "loading"
  >();
  const [isUserIdDuplicate, setIsUserIdDuplicate] = useState<
    boolean | "loading"
  >();

  const [nickname, name, gender, userId, pw, checkedPw] = watch([
    "nickname",
    "name",
    "gender",
    "userId",
    "pw",
    "checkedPw"
  ]);
  const debounceNickName = useDebounce(nickname);
  const debounceUserId = useDebounce(userId);
  const doneButtonDisable =
    !nickname ||
    !name ||
    !userId ||
    !pw ||
    !checkedPw ||
    pw !== checkedPw ||
    (isNickNameDuplicate !== false && isNickNameDuplicate !== undefined) ||
    (isNickNameDuplicate === undefined && nickname !== nickNameRef.current) ||
    isUserIdDuplicate !== false ||
    Object.keys(errors).length > 0;

  const handleSignUp = async () => {
    if (!verification.phone || doneButtonDisable) {
      return;
    }

    try {
      await postSignUp({
        userId,
        pw,
        checkedPw,
        name,
        nickname,
        gender,
        phone: verification.phone,
        agreeReqDTOS: agreements.map(({ agreeCodeId, agree }) => ({
          agreeCodeId,
          agree
        }))
      });

      navigator("/sign-up/complete");
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
        setIsNickNameDuplicate(data);

        if (data) {
          setError("nickname", { message: "이미 등록된 닉네임입니다" });
        }
      } catch {
        setIsNickNameDuplicate(undefined);
      }
    };

    void checkEmailValidity();
  }, [debounceNickName, errors.nickname, nickname, setError]);

  useEffect(() => {
    if (errors.userId) {
      return;
    }

    const checkEmailValidity = async () => {
      if (userId !== debounceUserId || !debounceUserId) {
        // 디바운스 중이거나, 아이디가 없는 경우
        setIsUserIdDuplicate(undefined);
        return;
      }

      setIsUserIdDuplicate("loading");

      try {
        // TODO tanstack-query 적용해서 캐싱
        const { data } = await getCheckUserId(debounceUserId);
        setIsUserIdDuplicate(data);

        if (data) {
          setError("userId", { message: "이미 등록된 아이디입니다" });
        }
      } catch {
        setIsUserIdDuplicate(undefined);
      }
    };

    void checkEmailValidity();
  }, [debounceUserId, errors.userId, setError, userId]);

  return (
    <>
      <h1 className={classNames("text-center text-3xl font-semibold")}>
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
                className={classNames("ml-2 flex-shrink-0", "w-[160px]")}
                currentValue={gender}
                onChangeHandler={value => setValue("gender", value)}
                options={genderOptions}
              />
            </Input>
            <Input
              error={errors.userId?.message}
              formData={{ ...register("userId") }}
              insideNode={
                isUserIdDuplicate ===
                undefined ? undefined : isUserIdDuplicate === "loading" ? (
                  <Spinner />
                ) : isUserIdDuplicate ? (
                  <LabelText type={"error"}>사용불가</LabelText>
                ) : (
                  <LabelText>사용가능</LabelText>
                )
              }
              label={"아이디(이메일)"}
              placeholder={"이메일을 입력해 주세요"}
            />
            <Input
              error={errors.pw?.message}
              formData={{
                ...register("pw", {
                  onChange: () => trigger("checkedPw")
                })
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
              disabled={doneButtonDisable}
              onClick={handleSignUp}
            >
              가입하기
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
                    code: verificationCode
                  });
                  return true;
                } catch (e) {
                  if (checkObjectType(e) && "errorCode" in e) {
                    return e.errorCode === "400-AUTH-05"
                      ? "400-AUTH-05"
                      : (e.errorMessage as string);
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
