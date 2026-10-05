'use client';

import { Icon } from '@iconify/react';

interface TorchControlProps {
  supported: boolean;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export const TorchControl = ({
  supported,
  enabled,
  onToggle,
  disabled = false,
}: TorchControlProps) => {
  if (!supported) {
    return null;
  }

  const handleClick = () => {
    if (!disabled) {
      onToggle(!enabled);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`flex min-h-12 min-w-12 items-center justify-center rounded-full p-4 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
        enabled
          ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      } ${disabled ? 'cursor-not-allowed bg-gray-600 text-gray-500' : 'cursor-pointer active:scale-95'} `}
      aria-label={enabled ? 'Apagar linterna' : 'Encender linterna'}
      aria-pressed={enabled}
      title={enabled ? 'Apagar linterna' : 'Encender linterna'}
    >
      <Icon
        icon={enabled ? 'lucide:flashlight' : 'lucide:flashlight-off'}
        width={24}
        height={24}
        aria-hidden='true'
      />
    </button>
  );
};
