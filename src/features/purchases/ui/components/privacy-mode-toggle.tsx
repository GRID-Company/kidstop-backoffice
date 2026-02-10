'use client';

import { Switch } from '@heroui/react';
import { Icon } from '@iconify/react';

import { usePrivacyModeStore } from '@/lib/store/privacy-mode';

export default function PrivacyModeToggle() {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacyModeStore();

  return (
    <Switch
      isSelected={isPrivacyMode}
      onValueChange={togglePrivacyMode}
      size="sm"
      classNames={{ wrapper: 'group-data-[selected=true]:bg-accent' }}
      startContent={<Icon icon="lucide:eye-off" width={14} />}
      endContent={<Icon icon="lucide:eye" width={14} />}
    >
      <span className="text-sm">Modo privacidad</span>
    </Switch>
  );
}
