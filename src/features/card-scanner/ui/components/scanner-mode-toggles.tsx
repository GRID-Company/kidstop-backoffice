import { ScannerToggleButton } from './scanner-toggle-button';
import { ScannerAiGuide } from './scanner-ai-guide';

interface ScannerModeTogglesProps {
  autoCapture: boolean;
  onAutoCaptureChange: (enabled: boolean) => void;
  aiSearchOnly: boolean;
  onAiSearchOnlyChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export const ScannerModeToggles = ({
  autoCapture,
  onAutoCaptureChange,
  aiSearchOnly,
  onAiSearchOnlyChange,
  disabled = false,
}: ScannerModeTogglesProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {!aiSearchOnly && (
        <ScannerToggleButton
          icon='lucide:zap-off'
          activeIcon='lucide:zap'
          isActive={autoCapture}
          onToggle={onAutoCaptureChange}
          label='Captura automática'
          disabled={disabled}
        />
      )}
      <ScannerToggleButton
        icon='lucide:sparkles'
        isActive={aiSearchOnly}
        onToggle={onAiSearchOnlyChange}
        label='Búsqueda solo con IA'
        disabled={disabled}
      />
      <ScannerAiGuide />
    </div>
  );
};
