import { ReactNode } from "react";

import { create } from "zustand/react";

type toastType = {
  id: number;
  message: string;
  type?: "success" | "error";
  isRemoving: boolean;
};

type toastStoreType = {
  toastList: toastType[];
  setToast: (toast: Omit<toastType, "id" | "isRemoving">) => void;
};

export const useToastStore = create<toastStoreType>(set => ({
  toastList: [],
  setToast: toast =>
    set(({ toastList }) => {
      // 생성된 시점
      const id = Date.now();

      setTimeout(() => {
        // 1.5초 후 생성된 toast isRemoving 변경
        set(({ toastList }) => ({
          toastList: toastList.map(toast =>
            toast.id === id ? { ...toast, isRemoving: true } : toast
          )
        }));

        setTimeout(() => {
          // 0.5초 후 토스트 제거
          set(state => ({
            toastList: state.toastList.slice(0, -1)
          }));
        }, 500);
      }, 1500);

      // 토스트 생성
      return {
        toastList: [{ ...toast, id, isRemoving: false }, ...toastList]
      };
    })
}));

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