'use client';

import { PropsWithChildren } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useCardShell } from './context';

interface FooterProps extends PropsWithChildren {
  className?: string;
}

export function Footer({ children, className }: FooterProps) {
  return (
    <div
      className={`border-default-100 bg-default-50 mt-auto flex items-center gap-2 border-t px-3 py-2.5 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

interface DetailButtonProps {
  onPress?: () => void;
  className?: string;
  testId?: string;
}

export function DetailButton({
  onPress,
  className,
  testId,
}: DetailButtonProps) {
  return (
    <Button
      variant='bordered'
      size='sm'
      onPress={onPress}
      className={`text-default-600 hover:border-accent hover:text-accent h-8 flex-1 text-[11px] font-semibold ${className ?? ''}`}
      data-testid={testId}
    >
      Ver detalle · Inventario ↗
    </Button>
  );
}

interface ZoomButtonProps {
  className?: string;
  testId?: string;
}

export function ZoomButton({ className, testId }: ZoomButtonProps) {
  const { openPreview, alt } = useCardShell();
  return (
    <Button
      isIconOnly
      variant='bordered'
      size='sm'
      onPress={openPreview}
      className={`text-default-500 hover:border-accent hover:text-accent hidden h-8 w-8 sm:inline-flex ${className ?? ''}`}
      aria-label={`Ampliar imagen de ${alt}`}
      data-testid={testId}
    >
      <Icon icon='lucide:expand' width={14} />
    </Button>
  );
}
