import { useEffect, useRef, useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { CardScanEffort } from '@/lib/api/schema-types';

interface ScannerEffortButtonProps {
  effort: CardScanEffort;
  onEffortChange: (effort: CardScanEffort) => void;
  disabled?: boolean;
}

const NEXT_EFFORT: Record<CardScanEffort, CardScanEffort> = {
  [CardScanEffort.Normal]: CardScanEffort.High,
  [CardScanEffort.High]: CardScanEffort.Max,
  [CardScanEffort.Max]: CardScanEffort.Normal,
};

const EFFORT_CONFIG: Record<
  CardScanEffort,
  { icon: string; label: string; description: string; activeClass: string }
> = {
  [CardScanEffort.Normal]: {
    icon: 'lucide:search',
    label: 'Normal',
    description: 'Busca en el catálogo primero y usa IA solo como respaldo.',
    activeClass: 'bg-black/50 backdrop-blur-sm hover:bg-black/70',
  },
  [CardScanEffort.High]: {
    icon: 'lucide:sparkles',
    label: 'IA',
    description: 'La IA resuelve la carta primero (Gemini Flash).',
    activeClass: 'bg-accent shadow-lg',
  },
  [CardScanEffort.Max]: {
    icon: 'lucide:brain',
    label: 'IA Pro',
    description: 'La IA resuelve la carta primero (Gemini Pro, más preciso).',
    activeClass: 'bg-secondary shadow-lg',
  },
};

const TOOLTIP_FLASH_MS = 1800;

export const ScannerEffortButton = ({
  effort,
  onEffortChange,
  disabled = false,
}: ScannerEffortButtonProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

  const config = EFFORT_CONFIG[effort];

  const handlePress = () => {
    onEffortChange(NEXT_EFFORT[effort]);
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }
    setTooltipOpen(true);
    flashTimeoutRef.current = setTimeout(
      () => setTooltipOpen(false),
      TOOLTIP_FLASH_MS
    );
  };

  return (
    <Tooltip
      content={`${config.label} · ${config.description}`}
      placement='right'
      delay={100}
      isOpen={tooltipOpen}
      onOpenChange={setTooltipOpen}
    >
      <Button
        isIconOnly
        radius='full'
        size='sm'
        onPress={handlePress}
        isDisabled={disabled}
        aria-label={`Nivel de búsqueda con IA: ${config.label}`}
        className={`h-10 w-10 text-white transition-all ${config.activeClass}`}
      >
        <Icon icon={config.icon} width={18} aria-hidden='true' />
      </Button>
    </Tooltip>
  );
};
