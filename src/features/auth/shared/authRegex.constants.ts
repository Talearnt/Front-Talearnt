// 정규식
export const userIdRegex =
  /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

export const pwRegex =
  /^$|^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?~-]).{8,}$/;

export const nameRegex = /^$|^[가-힣]{2,5}$/;

export const nicknameRegex = /^$|^[가-힣a-zA-Z0-9#]{2,12}$/;
