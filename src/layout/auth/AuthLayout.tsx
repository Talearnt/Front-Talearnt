import { ReactNode } from "react";

import { classNames } from "@shared/utils/classNames";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={classNames("flex flex-col gap-[56px]", "mt-24 w-[632px]")}>
      {children}
    </div>
  );
}

export { AuthLayout };
