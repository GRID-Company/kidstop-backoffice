import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ScannerToggleButtonProps {
  icon: string;
  activeIcon?: string;
  isActive: boolean;
  onToggle: (active: boolean) => void;
  label: string;
  disabled?: boolean;
}

export const ScannerToggleButton = ({
  icon,
  activeIcon,
  isActive,
  onToggle,
  label,
  disabled = false,
}: ScannerToggleButtonProps) => {
  return (
    <Tooltip content={label} placement='right' delay={100}>
      <Button
        isIconOnly
        radius='full'
        size='sm'
        onPress={() => onToggle(!isActive)}
        isDisabled={disabled}
        aria-label={label}
        aria-pressed={isActive}
        className={`h-10 w-10 transition-all ${
          isActive
            ? 'bg-accent text-white shadow-lg'
            : 'bg-black/50 text-white backdrop-blur-sm hover:bg-black/70'
        }`}
      >
        <Icon
          icon={isActive && activeIcon ? activeIcon : icon}
          width={18}
          aria-hidden='true'
        />
      </Button>
    </Tooltip>
  );
};
