import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { postSignIn } from "@pages/auth/api/auth.api";

import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { CheckBox } from "@components/CheckBox/CheckBox";
import { Input } from "@components/Input/Input";

import { apiErrorType } from "@common/common.type";
import { accountType } from "@pages/auth/api/auth.type";

const signInSchema = object({
  userId: string().required("이메일을 입력해 주세요"),
  pw: string().required("비밀번호를 입력해 주세요")
}).required();

function SignIn() {
  const navigator = useNavigate();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError
  } = useForm({
    resolver: yupResolver(signInSchema)
  });

  const onSubmit = async (data: accountType) => {
    try {
      await postSignIn(data);
      navigator("/");
    } catch (e) {
      const { errorMessage } = e as apiErrorType;
      setError("userId", { message: "" });
      setError("pw", { message: errorMessage });
    }
  };

  return (
    <div className={classNames("flex flex-col items-center", "w-[416px]")}>
      <h1 className={"mb-10 text-[1.875rem]"}>로그인</h1>
      <form
        className={"flex w-full flex-col"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          error={errors.userId?.message}
          formData={{ ...register("userId") }}
          id={"id-input"}
          label={"아이디"}
          placeholder={"이메일을 입력해 주세요."}
          wrapperClassName={"mb-6"}
        />
        <Input
          error={errors.pw?.message}
          formData={{ ...register("pw") }}
          id={"pw-input"}
          label={"비밀번호"}
          placeholder={"비밀번호를 입력해 주세요."}
          type={"password"}
          wrapperClassName={"mb-4"}
        />
        <CheckBox className={"mb-[26px] mr-auto"}>자동 로그인</CheckBox>
        <Button className={"mb-10 h-[50px] w-full"} type={"submit"}>
          로그인
        </Button>
      </form>
      <p className={"separator mb-6 w-full"}>간편 로그인</p>
      <Button
        className={
          "mb-6 h-[50px] w-full gap-2 bg-[#FAE100] text-[#212121] hover:bg-[#FAE100]"
        }
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
        <Button buttonStyle={"outlined"} className={"h-[50px] w-full"}>
          회원가입
        </Button>
      </div>
    </div>
  );
}

export default SignIn;
