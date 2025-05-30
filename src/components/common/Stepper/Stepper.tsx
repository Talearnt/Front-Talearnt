import { Fragment } from "react";

import { classNames } from "@shared/utils/classNames";

type StepperProps = {
  className?: string;
  currentStep: number;
  stepArray: string[];
};

function Stepper({ className, currentStep, stepArray }: StepperProps) {
  return (
    <div className={classNames("flex items-center", "pb-[26px]", className)}>
      {stepArray.map((step, index) => (
        <Fragment key={`${step}-${index}`}>
          <div className={"relative"}>
            <svg
              className={
                currentStep > index
                  ? "fill-talearnt_Primary_01"
                  : "fill-talearnt_Icon_04"
              }
              width={50}
              height={50}
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 50 50"
            >
              <circle cx="25" cy="25" r="25" />
              <text
                className={classNames(
                  "fill-talearnt_BG_Background",
                  "text-body1_18_semibold"
                )}
                x="25"
                y="25"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {index + 1}
              </text>
            </svg>
            <span
              className={classNames(
                "absolute",
                "mt-2",
                "whitespace-nowrap text-caption1_14_medium"
              )}
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
                    ? "border-talearnt_Primary_01"
                    : "border-talearnt_Icon_04"
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
