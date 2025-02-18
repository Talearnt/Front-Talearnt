import { RefObject, useEffect } from "react";

const useOutsideClick = (
  wrapperRef: RefObject<HTMLDivElement>,
  checkboxRef: RefObject<HTMLInputElement>
) => {
  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        checkboxRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        checkboxRef.current.checked = false;
      }
    };

    window.addEventListener("click", handleClose);

    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, [wrapperRef, checkboxRef]);
};

export { useOutsideClick };
