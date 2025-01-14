export type talentsType = "giveTalents" | "receiveTalents";

export type talentsDataType = Record<
  talentsType,
  { label: string; value: number }[]
>;
