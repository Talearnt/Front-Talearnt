import { useNavigate } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  postFindPwEmail,
  putChangePw,
} from "@features/auth/findAccount/findAccount.api";
import {
  postConfirmVerificationCode,
  postSendVerificationCode,
} from "@features/auth/shared/verificationCode.api";
import {
  getKakaoAccessToken,
  postSignIn,
} from "@features/auth/signIn/signIn.api";
import {
  getCheckNickName,
  getCheckUserId,
  getRandomNickName,
  postKakaoSignUp,
  postSignUp,
} from "@features/auth/signUp/signUp.api";

import { usePromptStore } from "@store/prompt.store";
import { useToastStore } from "@store/toast.store";
import { useAuthStore } from "@store/user.store";

import { findIdResponseType } from "@features/auth/findAccount/findAccount.type";
import { verificationBodyType } from "@features/auth/shared/verificationCode.type";
import { signInBodyType } from "@features/auth/signIn/signIn.type";
import { signUpBodyType } from "@features/auth/signUp/signUp.type";
import {
  customAxiosResponseType,
  responseDataType,
} from "@shared/type/api.type";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

/**
 * 닉네임 중복 체크
 */
export const useCheckNickname = (
  debounceNickname: string | undefined,
  enabled: boolean
) =>
  useQuery<customAxiosResponseType<boolean>, responseDataType<null>>({
    queryKey: QueryKeyFactory.auth.nicknameCheck(debounceNickname),
    queryFn: async () => {
      if (!debounceNickname) throw new Error("닉네임이 필요합니다");
      return await getCheckNickName(encodeURIComponent(debounceNickname));
    },
    enabled: enabled && !!debounceNickname,
    ...CACHE_POLICIES.AUTH_VALIDATION,
  });

/**
 * 아이디 중복 체크
 */
export const useCheckUserId = (
  debounceUserId: string | undefined,
  enabled: boolean
) =>
  useQuery<customAxiosResponseType<boolean>, responseDataType<null>>({
    queryKey: QueryKeyFactory.auth.userIdCheck(debounceUserId),
    queryFn: async () => {
      if (!debounceUserId) throw new Error("아이디가 필요합니다");
      return await getCheckUserId(debounceUserId);
    },
    enabled: enabled && !!debounceUserId,
    ...CACHE_POLICIES.AUTH_VALIDATION,
  });

/**
 * 랜덤 닉네임 생성
 */
export const useGetRandomNickname = () =>
  useQuery<customAxiosResponseType<string>>({
    queryKey: QueryKeyFactory.auth.randomNickname(),
    queryFn: getRandomNickName,
    ...CACHE_POLICIES.AUTH_VALIDATION,
  });

/**
 * 로그인
 */
export const useSignIn = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: (data: signInBodyType) => postSignIn(data),
    onSuccess: ({ data }) => {
      setAccessToken(data.accessToken);
      navigate("/");
      setToast({
        message: "로그인이 완료되었습니다.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.errorMessage || "로그인에 실패했습니다.";
      setToast({
        message: errorMessage,
      });
    },
  });
};

/**
 * 회원가입
 */
export const useSignUp = () => {
  const navigate = useNavigate();
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  return useMutation({
    mutationFn: (data: signUpBodyType) => postSignUp(data),
    onSuccess: () => {
      navigate("/sign-up/complete");
      setToast({
        message: "회원가입이 완료되었습니다.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.errorMessage;

      if (errorMessage) {
        setToast({ message: errorMessage });
      } else {
        setPrompt({
          title: "서버 오류",
          content:
            "알 수 없는 이유로 회원가입에 실패하였습니다.\n다시 시도해 주세요.",
          onlyConfirm: true,
        });
      }
    },
  });
};

/**
 * 카카오 회원가입
 */
export const useKakaoSignUp = () => {
  const navigate = useNavigate();
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: (data: Omit<signUpBodyType, "pw" | "checkedPw">) =>
      postKakaoSignUp(data),
    onSuccess: () => {
      navigate("/kakao/complete");
      setToast({
        message: "회원가입이 완료되었습니다.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.errorMessage || "카카오 회원가입에 실패했습니다.";
      setToast({ message: errorMessage });
    },
  });
};

/**
 * 카카오 로그인
 */
export const useKakaoLogin = () => {
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: (code: string) => getKakaoAccessToken(code),
    onError: (error: any) => {
      const errorMessage =
        error?.errorMessage || "카카오 로그인에 실패했습니다.";
      setToast({ message: errorMessage });
    },
  });
};

/**
 * 인증번호 전송
 */
export const useSendVerificationCode = () => {
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: (data: verificationBodyType) => postSendVerificationCode(data),
    onSuccess: () => {
      setToast({
        message: "인증번호가 전송되었습니다.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.errorMessage || "인증번호 전송에 실패했습니다.";
      setToast({ message: errorMessage });
    },
  });
};

/**
 * 인증번호 확인
 */
export const useConfirmVerificationCode = <T = findIdResponseType>() => {
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: (data: verificationBodyType & { code: string }) =>
      postConfirmVerificationCode<T>(data),
    onError: (error: any) => {
      const errorMessage =
        error?.errorMessage || "인증번호 확인에 실패했습니다.";
      setToast({ message: errorMessage });
    },
  });
};

/**
 * 비밀번호 찾기 이메일 전송
 */
export const useFindPasswordEmail = () => {
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: (data: { phone: string; userId: string }) =>
      postFindPwEmail(data),
    onSuccess: () => {
      setToast({
        message: "비밀번호 재설정 이메일이 전송되었습니다.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.errorMessage || "이메일 전송에 실패했습니다.";
      setToast({ message: errorMessage });
    },
  });
};

/**
 * 비밀번호 변경
 */
export const useChangePassword = () => {
  const navigate = useNavigate();
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: (data: {
      no: string;
      uuid: string;
      pw: string;
      checkedPw: string;
    }) => putChangePw(data),
    onSuccess: () => {
      navigate("/sign-in");
      setToast({
        message: "비밀번호가 성공적으로 변경되었습니다.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.errorMessage || "비밀번호 변경에 실패했습니다.";
      setToast({ message: errorMessage });
    },
  });
};
