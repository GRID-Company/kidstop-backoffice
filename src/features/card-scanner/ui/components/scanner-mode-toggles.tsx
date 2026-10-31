import { CardScanEffort } from '@/lib/api/schema-types';
import { ScannerEffortButton } from './scanner-effort-button';
import { ScannerAiGuide } from './scanner-ai-guide';

interface ScannerModeTogglesProps {
  effort: CardScanEffort;
  onEffortChange: (effort: CardScanEffort) => void;
  disabled?: boolean;
}

export const ScannerModeToggles = ({
  effort,
  onEffortChange,
  disabled = false,
}: ScannerModeTogglesProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <ScannerEffortButton
        effort={effort}
        onEffortChange={onEffortChange}
        disabled={disabled}
      />
      <ScannerAiGuide />
    </div>
  );
};
