/**
 * 쿠키에서 특정 이름의 값을 가져오는 헬퍼 함수
 */
export const getCookie = (name: string): string | null => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }

    return null;
  } catch (error) {
    console.error(`Failed to get cookie ${name}:`, error);
    return null;
  }
};
