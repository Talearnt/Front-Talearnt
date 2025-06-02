import { MouseEvent, ReactNode, useRef, useState } from "react";

import { classNames } from "@shared/utils/classNames";

type HorizontalScrollWrapperProps = {
  className?: string;
  children: ReactNode;
};

function HorizontalScrollWrapper({
  className,
  children,
}: HorizontalScrollWrapperProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0));
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
  };
  const onMouseLeave = () => {
    setIsDragging(false);
    setStartX(0);
    setScrollLeft(0);
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) {
      return;
    }

    e.preventDefault();

    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 1.5;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      className={classNames(
        "horizontal flex",
        "cursor-grab overflow-x-auto",
        isDragging && "cursor-grabbing",
        className
      )}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}

export { HorizontalScrollWrapper };
