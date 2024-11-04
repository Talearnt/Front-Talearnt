import { Fragment } from "react";

import { classNames } from "@utils/classNames";

type StepperProps = {
  className?: string;
  currentStep: number;
  stepArray: string[];
};

function Stepper({ className, currentStep, stepArray }: StepperProps) {
  return (
    <div className={classNames("flex items-center", className)}>
      {stepArray.map((step, index) => (
        <Fragment key={`${step}-${index.toString()}`}>
          <div className={"relative"}>
            <svg
              className={
                currentStep > index
                  ? "fill-talearnt-Primary_01"
                  : "fill-talearnt-Icon_03"
              }
              width={50}
              height={50}
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 50 50"
            >
              <circle cx="25" cy="25" r="25" />
              <text
                className={"fill-talearnt-BG_Background text-lg"}
                x="25"
                y="25"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {index + 1}
              </text>
            </svg>
            <span
              className={"absolute mt-2 whitespace-nowrap text-sm font-medium"}
            >
              {step}
            </span>
          </div>
          {stepArray.length > index + 1 && (
            <div className={"flex-auto"}>
              <span
                className={classNames(
                  "block border-t",
                  currentStep > index + 1
                    ? "border-talearnt-Primary_01"
                    : "border-talearnt-Icon_03"
                )}
              />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export { Stepper };
