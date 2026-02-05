import { PropsWithChildren } from 'react';

export type TitleBaseProps = {
  className?: string;
  label: string;
};

export type TitleProps = PropsWithChildren<TitleBaseProps>;

export function Title({ className, label }: TitleProps) {
  return <p className={`text-lg text-white ${className}`}>{label}</p>;
}
Title.displayName = 'EntitiesPage.Title';
