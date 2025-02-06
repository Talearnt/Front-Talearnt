import { ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    conflictingClassGroups: {
      p: ["px", "py", "pt", "pr", "pb", "pl"],
      px: ["pl", "pr"],
      py: ["pt", "pb"]
    },
    classGroups: {
      "font-size": [
        "text-heading1_30_semibold",
        "text-heading2_24_semibold",
        "text-heading3_22_semibold",
        "text-heading4_20_semibold",
        "text-body1_18_semibold",
        "text-body1_18_medium",
        "text-body2_16_semibold",
        "text-body2_16_medium",
        "text-body3_14_medium",
        "text-caption1_14_medium",
        "text-caption2_12_semibold",
        "text-caption2_12_medium",
        "text-label1_10_semibold"
      ]
    }
  }
});

/**
 * tailwind용 className을 만들어주는 util
 *
 * @param {clsx.ClassValue} inputs
 * @returns {string}
 */
export const classNames = (...inputs: ClassValue[]): string =>
  twMerge(clsx(inputs));
