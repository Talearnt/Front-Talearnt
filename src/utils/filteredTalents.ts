import { CATEGORIZED_TALENTS_LIST } from "@common/common.constants";

export const filteredTalents = (talentCodes: (string | number)[]) => {
  if (talentCodes.length === 0) {
    return [];
  }

  const result: { talentCode: number; talentName: string }[] = [];
  const talentCodeSet = new Set(talentCodes);

  for (const { talents } of CATEGORIZED_TALENTS_LIST) {
    for (const talent of talents) {
      if (
        talentCodeSet.has(talent.talentCode) ||
        talentCodeSet.has(talent.talentName)
      ) {
        result.push(talent);
      }
    }
  }

  return result;
};
