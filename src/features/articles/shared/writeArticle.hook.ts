import { useCallback, useEffect } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

import { usePromptStore } from "@store/prompt.store";

type UsePreventPageLeaveProps = {
  /** 저장되지 않은 변경사항이 있는지 여부 */
  hasUnsavedChanges: boolean;
  /** 현재 업로드/저장 중인지 여부 */
  isProcessing: boolean;
  /** 수정 모드인지 여부 (제목/메시지 변경용) */
  isEditMode: boolean;
  /** 취소 시 이동할 경로 */
  cancelNavigationPath: string;
};

/**
 * 페이지 이탈 방지 훅
 * - 라우터 네비게이션 차단 (뒤로가기, 다른 페이지 이동)
 * - 브라우저 탭 닫기/새로고침 차단
 * - 취소 버튼 핸들러 제공
 *
 * @returns handleCancel - 취소 버튼 클릭 핸들러
 */
const TITLES: Record<"edit" | "write", string> = {
  edit: "게시물 수정 취소",
  write: "게시물 작성 취소",
} as const;
const CONTENTS: Record<"edit" | "write", string> = {
  edit: "페이지를 나가면 수정된 내용이 모두 유실됩니다. 그래도 나가시겠어요?",
  write: "페이지를 나가면 작성된 내용이 모두 유실됩니다. 그래도 나가시겠어요?",
} as const;

export function usePreventPageLeave({
  hasUnsavedChanges,
  isProcessing,
  isEditMode,
  cancelNavigationPath,
}: UsePreventPageLeaveProps) {
  const navigate = useNavigate();
  const setPrompt = usePromptStore(state => state.setPrompt);

  // 라우터 내부 네비게이션 차단
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges &&
      !isProcessing &&
      currentLocation.pathname !== nextLocation.pathname
  );

  // blocker가 활성화되면 Prompt 표시
  useEffect(() => {
    if (blocker.state === "blocked") {
      setPrompt({
        title: isEditMode ? TITLES.edit : TITLES.write,
        content: isEditMode ? CONTENTS.edit : CONTENTS.write,
        confirmOnClickHandler: () => blocker.proceed(),
        cancelOnClickHandler: () => blocker.reset(),
      });
    }
  }, [blocker, isEditMode, setPrompt]);

  // 브라우저 탭 닫기/새로고침 차단
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isProcessing) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, isProcessing]);

  // 취소 버튼 핸들러
  const handleCancel = useCallback(() => {
    setPrompt({
      title: isEditMode ? TITLES.edit : TITLES.write,
      content: isEditMode ? CONTENTS.edit : CONTENTS.write,
      confirmOnClickHandler: () => navigate(cancelNavigationPath),
    });
  }, [isEditMode, navigate, cancelNavigationPath, setPrompt]);

  return { handleCancel };
}
