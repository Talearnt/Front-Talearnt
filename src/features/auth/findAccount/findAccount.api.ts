import { postAPI, putAPI } from "@shared/utils/apiMethods";

import { signUpBodyType } from "@features/auth/signUp/signUp.type";

// 비밀번호 찾기
export const postFindPwEmail = (body: { phone: string; userId: string }) =>
  postAPI<{ sentDate: string }>("/v1/auth/password/email", body);

// 비밀번호 수정
export const putChangePw = ({
  no,
  uuid,
  ...body
}: Pick<signUpBodyType, "checkedPw" | "pw"> & {
  no: string;
  uuid: string;
}) => putAPI(`/v1/auth/${no}/password/${uuid}`, body);
