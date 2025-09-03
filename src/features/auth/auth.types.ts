import { signUpBodyType } from "@features/auth/signUp/signUp.type";
import { signInBodyType } from "@features/auth/signIn/signIn.type";

/**
 * Auth 관련 에러 타입
 */
export interface AuthError {
  errorCode: string;
  errorMessage: string;
  statusCode?: number;
}

/**
 * Auth 관련 응답 타입들
 */
export interface AuthSuccessResponse<T = any> {
  data: T;
  success: true;
  errorCode: null;
  errorMessage: null;
}

export interface AuthErrorResponse {
  data: null;
  success: false;
  errorCode: string;
  errorMessage: string;
}

export type AuthResponse<T = any> = AuthSuccessResponse<T> | AuthErrorResponse;

/**
 * 로그인 응답 타입
 */
export interface SignInResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * 회원가입 응답 타입
 */
export interface SignUpResponse {
  userNo: number;
  userId: string;
  nickname: string;
}

/**
 * 중복 체크 응답 타입
 */
export type DuplicateCheckResponse = boolean; // true: 중복, false: 사용가능

/**
 * 카카오 로그인 응답 타입
 */
export interface KakaoLoginResponse {
  accessToken: string;
  isRegistered: boolean;
  userId: string;
  name: string;
  phone: string;
  gender: string;
}

/**
 * 인증번호 전송 응답 타입
 */
export interface VerificationSendResponse {
  sentDate: string;
  expiresAt: string;
}

/**
 * 인증번호 확인 응답 타입 (제네릭)
 */
export interface VerificationConfirmResponse<T = any> {
  verified: boolean;
  data?: T;
}

/**
 * 비밀번호 찾기 응답 타입
 */
export interface FindPasswordResponse {
  sentDate: string;
  email: string;
}

/**
 * 비밀번호 변경 응답 타입
 */
export interface ChangePasswordResponse {
  success: boolean;
  changedAt: string;
}

/**
 * Auth hook 옵션 타입들
 */
export interface UseSignInOptions {
  onSuccess?: (data: SignInResponse) => void;
  onError?: (error: AuthError) => void;
  redirectTo?: string;
}

export interface UseSignUpOptions {
  onSuccess?: (data: SignUpResponse) => void;
  onError?: (error: AuthError) => void;
  redirectTo?: string;
}

export interface UseVerificationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AuthError) => void;
  autoStartTimer?: boolean;
  timerDuration?: number;
}

/**
 * Auth 상태 타입
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    userNo: number;
    userId: string;
    nickname: string;
    profileImg?: string;
  } | null;
  accessToken: string | null;
  isLoading: boolean;
}

/**
 * Auth 액션 타입
 */
export interface AuthActions {
  signIn: (data: signInBodyType) => Promise<void>;
  signUp: (data: signUpBodyType) => Promise<void>;
  signOut: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<AuthState["user"]>) => void;
}

/**
 * 폼 필드 검증 상태 타입
 */
export interface FieldValidationState {
  isValid: boolean;
  isChecking: boolean;
  message?: string;
  lastCheckedValue?: string;
}

/**
 * Auth 폼 상태 타입
 */
export interface AuthFormState {
  nickname: FieldValidationState;
  userId: FieldValidationState;
  password: FieldValidationState;
  confirmPassword: FieldValidationState;
  verificationCode: FieldValidationState;
}

/**
 * 타입 가드 함수들
 */
export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "errorCode" in error &&
    "errorMessage" in error
  );
}

export function isAuthSuccessResponse<T>(
  response: AuthResponse<T>
): response is AuthSuccessResponse<T> {
  return response.success === true;
}

export function isAuthErrorResponse(
  response: AuthResponse
): response is AuthErrorResponse {
  return response.success === false;
}
