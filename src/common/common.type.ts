import { ComponentProps, JSX, JSXElementConstructor, ReactNode } from "react";

type CommonPropsGenericType =
  | keyof JSX.IntrinsicElements
  | JSXElementConstructor<never>;

export type CommonPropsType<
  T extends CommonPropsGenericType,
  ExcludeProps extends keyof ComponentProps<T> = "never"
> = Omit<ComponentProps<T>, ExcludeProps | "className"> & {
  additionalClass?: string;
};

export type CommonPropsWithChildrenType<
  T extends CommonPropsGenericType,
  ExcludeProps extends keyof ComponentProps<T> = "never"
> = CommonPropsType<T, ExcludeProps> & {
  children?: ReactNode;
};
