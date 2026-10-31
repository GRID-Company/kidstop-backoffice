'use client';

import { PropsWithChildren } from 'react';
import Root from './root';
import Image from './image';
import {
  Availability,
  Header,
  Ident,
  Title,
  Number,
  Subtitle,
  ChipRow,
  PriceBar,
  ConditionRow,
  CostLine,
} from './slots';
import { TCGType } from '@/lib/types/tcg.types';

interface CardShellProps extends PropsWithChildren {
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

export function CardShell({
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
}: CardShellProps) {
  return (
    <Root
      tcgType={tcgType}
      imageSrc={imageSrc}
      alt={alt}
      available={available}
      compact={compact}
      showCosts={showCosts}
      className={className}
      testId={testId}
      onPress={onPress}
    >
      {children}
    </Root>
  );
}

CardShell.Header = Header;
CardShell.Availability = Availability;
CardShell.Ident = Ident;
CardShell.Image = Image;
CardShell.Title = Title;
CardShell.Number = Number;
CardShell.Subtitle = Subtitle;
CardShell.ChipRow = ChipRow;
CardShell.PriceBar = PriceBar;
CardShell.ConditionRow = ConditionRow;
CardShell.CostLine = CostLine;

export default CardShell;
