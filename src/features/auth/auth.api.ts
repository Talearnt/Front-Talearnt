import { postAPI } from "@shared/utils/apiMethods";

// 로그아웃
export const postSignOut = () => postAPI("/v1/auth/logout");
