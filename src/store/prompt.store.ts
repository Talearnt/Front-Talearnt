import { ReactNode } from "react";

import { create } from "zustand/react";

type promptType = {
  title: ReactNode;
  content: ReactNode;
  confirmOnClickHandler?: () => void;
  cancelOnClickHandler?: () => void;
};

type promptStoreType = {
  promptData?: promptType;
  setPrompt: (prompt?: promptType) => void;
};

export const usePromptStore = create<promptStoreType>(set => ({
  promptData: undefined,
  setPrompt: prompt => set({ promptData: prompt })
}));
