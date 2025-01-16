import { createRef, RefObject } from "react";

import { create } from "zustand/react";

import {
  talentsDataType,
  talentsType
} from "@modal/TalentsSettingModal/core/talentsSettingModal.type";

type talentsSettingModalStoreType = {
  scrollRef: RefObject<HTMLDivElement>; // 스크롤이 발생하는 div에 걸어주는 ref
  currentTalentsType: talentsType; // 현재 어떤 재능을 선택하고있는지
  setCurrentTalentsType: (type: talentsType) => void;
  talentsData: talentsDataType; // 주고싶은, 받고싶은 재능을 저장
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
