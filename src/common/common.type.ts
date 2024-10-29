export type CustomVariantProps<
  T extends Record<string, Record<string, string>>
> = {
  [K in keyof T]: keyof T[K];
};
