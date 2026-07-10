import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { EXPORT_MESSAGES } from '@/lib/consts/export-messages';

interface ExportButtonProps {
  onPress: () => void;
  isLoading: boolean;
  tooltipContent?: string;
}

export const ExportButton = ({
  onPress,
  isLoading,
  tooltipContent = EXPORT_MESSAGES.TOOLTIP,
}: ExportButtonProps) => (
  <Tooltip content={tooltipContent}>
    <Button
      className="bg-accent text-white"
      startContent={<Icon icon="solar:download-minimalistic-bold" width={16} />}
      size="sm"
      onPress={onPress}
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      Exportar
    </Button>
  </Tooltip>
);
