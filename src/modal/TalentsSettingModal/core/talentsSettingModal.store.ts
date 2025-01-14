import { createRef, RefObject } from "react";

import { create } from "zustand/react";

import {
  talentsDataType,
  talentsType
} from "@modal/TalentsSettingModal/core/talentsSettingModal.type";

type talentsSettingModalStoreType = {
  scrollRef: RefObject<HTMLDivElement>;
  currentTalentsType: talentsType;
  setCurrentTalentsType: (type: talentsType) => void;
  talentsData: talentsDataType;
  setTalentsData: (data: {
    type: "add" | "remove";
    talent: { label: string; value: number };
  }) => void;
  status: "default" | "loading" | "success";
  setStatus: (status: "default" | "loading" | "success") => void;
  isLoading: boolean;
  isSuccess: boolean;
};

export const useTalentsSettingModalStore = create<talentsSettingModalStoreType>(
  set => ({
    scrollRef: createRef<HTMLDivElement>(),
    currentTalentsType: "giveTalents",
    setCurrentTalentsType: type => set(() => ({ currentTalentsType: type })),
    talentsData: {
      giveTalents: [],
      receiveTalents: []
    },
    setTalentsData: ({ type, talent }) =>
      set(({ currentTalentsType, talentsData }) => {
        if (type === "add") {
          return {
            talentsData: {
              ...talentsData,
              [currentTalentsType]: [...talentsData[currentTalentsType], talent]
            }
          };
        } else {
          return {
            talentsData: {
              ...talentsData,
              [currentTalentsType]: talentsData[currentTalentsType].filter(
                ({ value }) => value !== talent.value
              )
            }
          };
        }
      }),
    status: "default",
    setStatus: status =>
      set(() => ({
        status,
        isLoading: status === "loading",
        isSuccess: status === "success"
      })),
    isLoading: false,
    isSuccess: false
  })
);
