export const userIdRegex =
  /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

export const pwRegex =
  /^$|^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?~-]).{8,}$/;

export const nameRegex = /^$|^[가-힣]{2,5}$/;
