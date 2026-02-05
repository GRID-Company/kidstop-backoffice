import { PropsWithChildren } from 'react';

export type RootBaseProps = {
  className?: string;
};

export type RootProps = PropsWithChildren<RootBaseProps>;

export function Root({ className, children }: RootProps) {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
}
Root.displayName = 'EntitiesPage.Root';
