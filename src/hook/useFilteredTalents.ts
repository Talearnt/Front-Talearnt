import { useMemo } from "react";

import { CATEGORIZED_TALENTS_LIST } from "@common/common.constants";

export const useFilteredTalents = (talentCodes: number[]) =>
  useMemo(() => {
    const result: { talentCode: number; talentName: string }[] = [];
    const talentCodeSet = new Set(talentCodes);

    for (const { talents } of CATEGORIZED_TALENTS_LIST) {
      for (const talent of talents) {
        if (talentCodeSet.has(talent.talentCode)) {
          result.push(talent);
        }
      }
    }

    return result;
  }, [talentCodes]);
