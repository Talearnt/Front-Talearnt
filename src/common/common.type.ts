import { ComponentProps } from "react";

export type CustomVariantProps<
  T extends Record<string, Record<string, string>>
> = {
  [K in keyof T]: keyof T[K];
};

export type CommonIconProps = ComponentProps<"svg"> & {
  scale?: number;
};
