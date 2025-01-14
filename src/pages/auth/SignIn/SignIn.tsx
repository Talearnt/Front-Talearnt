import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { postSignIn } from "@pages/auth/auth.api";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import { useAuthStore } from "@pages/auth/auth.store";

import { Button } from "@components/Button/Button";
import { CheckBox } from "@components/CheckBox/CheckBox";
import { Input } from "@components/Input/Input";

const signInSchema = object({
  userId: string(),
  pw: string()
}).required();

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = `${import.meta.env.VITE_BASE_URL}kakao/oauth`;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

function SignIn() {
  const navigator = useNavigate();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
    trigger,
    watch
  } = useForm({
    resolver: yupResolver(signInSchema)
  });

  const setAccessToken = useAuthStore(state => state.setAccessToken);

  const [userId, pw] = watch(["userId", "pw"]);

  const handleSignIn = async ({
    userId,
    pw
  }: {
    userId?: string;
    pw?: string;
  }) => {
    if (!userId || !pw) {
      if (!userId) {
        setError("userId", { message: "이메일을 입력해 주세요" });
      }

      if (!pw) {
        setError("pw", { message: "비밀번호를 입력해 주세요" });
      }
      return;
    }

    try {
      const { data } = await postSignIn({ userId, pw });

      setAccessToken(data.accessToken);
      navigator("/");
    } catch (e) {
      if (checkObjectType(e) && "errorMessage" in e) {
        setError("userId", { message: "" });
        setError("pw", { message: e.errorMessage as string });
        return;
      }

      setError("pw", {
        message: "예기치 못한 오류가 발생했습니다."
      });
    }
  };

  return (
    <div className={classNames("flex flex-col items-center", "w-[416px]")}>
      <h1 className={classNames("mb-[56px]", "text-[1.875rem]")}>로그인</h1>
      <form
        className={"flex w-full flex-col"}
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Input
          error={errors.userId?.message}
          formData={{
            ...register("userId", {
              onChange: () => !!pw && trigger("pw")
            })
          }}
          id={"id-input"}
          label={"아이디"}
          placeholder={"이메일을 입력해 주세요."}
          wrapperClassName={"mb-6"}
        />
        <Input
          error={errors.pw?.message}
          formData={{
            ...register("pw", {
              onChange: () => !!userId && trigger("userId")
            })
          }}
          id={"pw-input"}
          label={"비밀번호"}
          placeholder={"비밀번호를 입력해 주세요."}
          type={"password"}
          wrapperClassName={"mb-4"}
        />
        {/*TODO 자동 로그인 적용*/}
        <CheckBox className={"mb-6 mr-auto"}>자동 로그인</CheckBox>
        <Button className={"mb-10 h-[50px] w-full"} type={"submit"}>
          로그인
        </Button>
      </form>
      <p className={"separator mb-6 w-full font-medium"}>간편 로그인</p>
      <Button
        className={
          "mb-6 h-[50px] w-full gap-2 bg-[#FAE100] text-[#212121] hover:bg-[#FAE100]"
        }
        onClick={() => (window.location.href = KAKAO_AUTH_URL)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.9729 3C6.47061 3 2 6.61667 2 11.05C2 13.85 3.8341 16.3 6.47061 17.8167L5.78283 21.6667L10.0242 18.8667C10.5973 18.9833 11.2851 18.9833 11.8583 18.9833C17.3606 18.9833 21.8312 15.3667 21.8312 10.9333C21.9458 6.61667 17.4752 3 11.9729 3Z"
            fill="#3C1D1E"
          />
        </svg>
        카카오로 로그인
      </Button>
      <div className={"flex w-full gap-4"}>
        <Button
          buttonStyle={"outlined"}
          className={"h-[50px] w-full"}
          onClick={() => navigator("/find-account/id")}
        >
          아이디/비밀번호 찾기
        </Button>
        <Button
          buttonStyle={"outlined"}
          className={"h-[50px] w-full"}
          onClick={() => navigator("/sign-up/agreements")}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}

export default SignIn;
