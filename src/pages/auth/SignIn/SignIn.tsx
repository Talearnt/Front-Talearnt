import { Input } from "@components/Input/Input";

function SignIn() {
  return (
    <div className={"mx-auto mt-[6.5rem] flex w-[26rem] flex-col items-center"}>
      <h1 className={"mb-10 text-[1.875rem]"}>로그인</h1>
      <Input
        id={"id-input"}
        label={"아이디"}
        placeholder={"이메일을 입력해 주세요."}
        wrapperClassName={"mt-6"}
      />
      <Input
        id={"pw-input"}
        label={"비밀번호"}
        placeholder={"비밀번호를 입력해 주세요."}
        wrapperClassName={"mt-4"}
      />
    </div>
  );
}

export default SignIn;
