import { create } from "zustand";

import { pageStoreType } from "@shared/type/api.type";

export const useNoticePageStore = create<pageStoreType>(set => ({
  page: 1,
  setPage: page => set({ page }),
}));
