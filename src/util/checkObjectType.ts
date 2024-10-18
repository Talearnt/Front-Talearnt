export const checkObjectType = (data: string | number | object | null) =>
  typeof data === "object" && !Array.isArray(data) && data !== null;
