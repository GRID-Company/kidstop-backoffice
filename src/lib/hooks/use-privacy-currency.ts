'use client';

import { useCallback } from 'react';
import { usePrivacyModeStore } from '../store/privacy-mode';
import { formatCurrencyWithPrivacy } from '../utils/privacy.utils';

export const usePrivacyCurrency = () => {
  const { isPrivacyMode } = usePrivacyModeStore();

  return useCallback(
    (value: number): string => formatCurrencyWithPrivacy(value, isPrivacyMode),
    [isPrivacyMode]
  );
};
