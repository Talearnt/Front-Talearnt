import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * tailwind용 className을 만들어주는 util
 *
 * @param {clsx.ClassValue} inputs
 * @returns {string}
 */
export const classNames = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
