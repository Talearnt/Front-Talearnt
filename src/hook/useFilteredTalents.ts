import { useMemo } from "react";

import { filteredTalents } from "@utils/filteredTalents";

export const useFilteredTalents = (talentCodes: number[]) =>
  useMemo(() => filteredTalents(talentCodes), [talentCodes]);
