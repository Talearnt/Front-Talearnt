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

import useAgreementStore from "@pages/auth/api/auth.store";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { LabelText } from "@components/LabelText/LabelText";
import { Spinner } from "@components/Spinner/Spinner";
import { TabSlider } from "@components/TabSlider/TabSlider";
import { VerificationCode } from "@pages/auth/components/VerificationCode/VerificationCode";

import { verificationStateType } from "@pages/auth/api/auth.type";

const genderOptions = [
  {
    label: "남자",
    value: "남자"
  },
  {
    label: "여자",
    value: "여자"
  }
];

const infoFieldsSchema = object({
  nickname: string().required("닉네임을 입력해 주세요"),
  name: string()
    .required("이름을 입력해 주세요")
    .matches(
      /^$|^[가-힣]{2,5}$/,
      "이름은 최소 2글자에서 최대 5글자까지, 한글만 입력 가능합니다."
    ),
  gender: string().required(),
  userId: string()
    .required("아이디를 입력해 주세요")
    .matches(
      /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
      "올바른 이메일 형식으로 입력해 주세요"
    ),
  pw: string()
    .required("비밀번호를 입력해 주세요")
    .matches(
      /^$|^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?~-]).{8,}$/,
      "영문, 숫자, 특수 문자를 포함한 8자 이상의 비밀번호를 입력해 주세요."
    ),
  checkPw: string().oneOf([yupRef("pw"), ""], "비밀번호가 일치하지 않습니다.")
}).required();

function InfoFields() {
  const nickNameRef = useRef<string>("");
  const navigator = useNavigate();

  const {
    formState: { errors },
    register,
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

  const [nickname, name, gender, userId, pw, checkPw] = watch([
    "nickname",
    "name",
    "gender",
    "userId",
    "pw",
    "checkPw"
  ]);
  const debounceNickName = useDebounce(nickname);
  const debounceUserId = useDebounce(userId);
  const doneButtonDisable =
    !nickname ||
    !name ||
    !userId ||
    !pw ||
    !checkPw ||
    pw !== checkPw ||
    isNickNameDuplicate === "loading" ||
    isUserIdDuplicate === "loading";

  const handleSignUp = async () => {
    if (!verification.phone) {
      return;
    }

    try {
      await postSignUp({
        userId,
        pw,
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
    // 필수 약관 동의되어있지 않으면 약관 페이지로 이동 - URL 복붙 방지
    if (agreements.some(({ agree, required }) => !agree && required)) {
      navigator("/sign-up/agreements");
    }
  }, [agreements, navigator]);

  useEffect(() => {
    // nickName 인풋에 random nickname 적용
    getRandomNickName()
      .then(({ data }) => {
        setValue("nickname", data);
        nickNameRef.current = data;
      })
      .catch(() => setValue("nickname", ""));
  }, [setValue]);

  useEffect(() => {
    const checkEmailValidity = async () => {
      if (
        debounceNickName === nickNameRef.current ||
        !debounceNickName ||
        errors.nickname
      ) {
        setIsNickNameDuplicate(undefined);
        return;
      }

      setIsNickNameDuplicate("loading");

      try {
        const { data } = await getCheckNickName(debounceNickName);
        setIsNickNameDuplicate(data);
      } catch {
        setIsNickNameDuplicate(undefined);
      }
    };

    void checkEmailValidity();
  }, [debounceNickName, errors.nickname]);

  useEffect(() => {
    const checkEmailValidity = async () => {
      if (!debounceUserId || errors.userId) {
        setIsUserIdDuplicate(undefined);
        return;
      }

      setIsUserIdDuplicate("loading");

      try {
        const { data } = await getCheckUserId(debounceUserId);
        setIsUserIdDuplicate(data);
      } catch {
        setIsUserIdDuplicate(undefined);
      }
    };

    void checkEmailValidity();
  }, [debounceUserId, errors.userId]);

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
            <Input
              formData={{ ...register("nickname") }}
              insideNode={
                isNickNameDuplicate === "loading" ? (
                  <Spinner />
                ) : isNickNameDuplicate === false ? (
                  <LabelText>사용가능</LabelText>
                ) : undefined
              }
              label={"닉네임"}
              placeholder={"닉네임을 입력해 주세요"}
            />
            <Input
              error={errors.name?.message}
              formData={{ ...register("name") }}
              label={"이름"}
              placeholder={"이름을 입력해 주세요."}
            >
              <TabSlider
                className={classNames("ml-2", "w-[160px]")}
                currentValue={gender}
                onChangeHandler={value => setValue("gender", value)}
                options={genderOptions}
              />
            </Input>
            <Input
              error={errors.userId?.message}
              formData={{ ...register("userId") }}
              insideNode={
                isUserIdDuplicate === "loading" ? (
                  <Spinner />
                ) : isUserIdDuplicate === false ? (
                  <LabelText>확인완료</LabelText>
                ) : undefined
              }
              label={"아이디(이메일)"}
              placeholder={"이메일을 입력해 주세요"}
            />
            <Input
              error={errors.pw?.message}
              formData={{
                ...register("pw", {
                  onChange: () => trigger("checkPw")
                })
              }}
              label={"비밀번호"}
              placeholder={
                "영문, 숫자, 특수문자의 조합 8자리 이상 입력해 주세요"
              }
              type={"password"}
            />
            <Input
              error={errors.checkPw?.message}
              formData={{ ...register("checkPw") }}
              insideNode={
                checkPw && !errors.checkPw ? (
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
