import { TALENTS_MAP } from "@shared/constants/talentsList";

export const findTalent = (key: string | number) =>
  TALENTS_MAP.get(`${typeof key === "number" ? "code" : "name"}:${key}`);

export const findTalentList = (keys: (string | number)[]) => {
  const seen = new Set<number>();
  const result: { talentCode: number; talentName: string }[] = [];

  for (const key of keys) {
    const talent = findTalent(key);

    if (talent && !seen.has(talent.talentCode)) {
      result.push(talent);
      seen.add(talent.talentCode);
    }
  }

  return result;
};
