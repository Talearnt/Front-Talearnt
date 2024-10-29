/**
 * data의 type이 객체인지 확인하는 util
 * @param {string | number | object | null} data
 * @returns {boolean}
 */
export const checkObjectType = (data?: string | number | object | null) =>
  typeof data === "object" && !Array.isArray(data) && data !== null;
