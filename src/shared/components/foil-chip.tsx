'use client';

import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface FoilChipProps {
  label: string;
  variant?: 'solid' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

export default function FoilChip({ label, variant = 'solid', size = 'sm' }: FoilChipProps) {
  const iconSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  const classNames = variant === 'solid' 
    ? {
        base: 'bg-gradient-to-r from-yellow-400/90 to-amber-500/90',
        content: 'text-white font-semibold',
      }
    : {
        base: 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20',
        content: 'text-amber-600 font-semibold',
      };

  return (
    <Chip
      size={size}
      variant="flat"
      startContent={<Icon icon="lucide:sparkles" className={iconSize} />}
      classNames={classNames}
    >
      {label}
    </Chip>
  );
}
