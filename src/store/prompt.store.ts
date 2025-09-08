import { ReactNode } from "react";

import { create } from "zustand/react";

type promptType = {
  title: ReactNode;
  content: ReactNode;
  cancelOnClickHandler?: () => void;
  confirmOnClickHandler?: () => void;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  onlyConfirm?: boolean;
};

type promptStoreType = {
  promptData?: promptType;
  setPrompt: (prompt?: promptType) => void;
};

export const usePromptStore = create<promptStoreType>(set => ({
  promptData: undefined,
  setPrompt: prompt => set({ promptData: prompt }),
}));
