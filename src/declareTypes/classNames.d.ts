// types/classNames.d.ts

declare module "@utils/classNames" {
  import { ClassValue } from "clsx";

  export function classNames(...inputs: ClassValue[]): string;
}
