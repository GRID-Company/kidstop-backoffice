'use client';

import { PropsWithChildren } from 'react';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { TCGType } from '@/lib/types/tcg.types';
import { CardShellProvider } from './context';

interface RootProps extends PropsWithChildren {
  tcgType: TCGType;
  imageSrc: string | null;
  alt: string;
  available?: boolean;
  compact?: boolean;
  showCosts?: boolean;
  className?: string;
  testId?: string;
  onPress?: () => void;
}

export default function Root({
  tcgType,
  imageSrc,
  alt,
  available,
  compact,
  showCosts,
  className,
  testId,
  onPress,
  children,
}: RootProps) {
  return (
    <CardShellProvider
      tcgType={tcgType}
      imageSrc={imageSrc}
      alt={alt}
      available={available}
      compact={compact}
      showCosts={showCosts}
    >
      <KidstopCard
        isPressable={!!onPress}
        onPress={onPress}
        className={`h-full overflow-hidden ${className ?? ''}`}
        data-testid={testId}
      >
        <div className='flex h-full flex-col'>{children}</div>
      </KidstopCard>
    </CardShellProvider>
  );
}
