'use client';

import { Icon } from '@iconify/react';

interface PokemonTypeIconProps {
  type: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  Fire: { icon: 'mdi:fire', color: 'text-red-500' },
  Water: { icon: 'mdi:water', color: 'text-blue-500' },
  Grass: { icon: 'mdi:leaf', color: 'text-green-500' },
  Electric: { icon: 'mdi:lightning-bolt', color: 'text-yellow-500' },
  Psychic: { icon: 'mdi:eye', color: 'text-purple-500' },
  Fighting: { icon: 'mdi:karate', color: 'text-orange-700' },
  Darkness: { icon: 'mdi:moon-waning-crescent', color: 'text-gray-800' },
  Metal: { icon: 'mdi:shield', color: 'text-gray-400' },
  Dragon: { icon: 'mdi:dragon', color: 'text-indigo-600' },
  Fairy: { icon: 'mdi:star', color: 'text-pink-400' },
  Colorless: { icon: 'mdi:circle-outline', color: 'text-gray-500' },
  Lightning: { icon: 'mdi:lightning-bolt', color: 'text-yellow-500' },
};

const SIZE_MAP = {
  sm: 14,
  md: 18,
  lg: 24,
};

export default function PokemonTypeIcon({
  type,
  size = 'md',
  showLabel = false,
  className = '',
}: PokemonTypeIconProps) {
  if (!type) return null;
  
  const typeConfig = TYPE_ICONS[type] || { icon: 'mdi:help-circle', color: 'text-default-400' };

  const iconSize = SIZE_MAP[size];

  if (showLabel) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Icon icon={typeConfig.icon} width={iconSize} className={typeConfig.color} />
        <span className="text-xs text-default-600">{type}</span>
      </div>
    );
  }

  return (
    <Icon
      icon={typeConfig.icon}
      width={iconSize}
      className={`${typeConfig.color} ${className}`}
    />
  );
}
