export type HapticPattern = number | number[];

import { IHapticCapabilities } from './types';

export const checkHapticSupport = (): IHapticCapabilities => {
  if (typeof navigator === 'undefined') {
    return { supported: false };
  }

  if ('vibrate' in navigator) {
    return { supported: true, vendor: 'standard' };
  }

  if ('webkitVibrate' in navigator) {
    return { supported: true, vendor: 'webkit' };
  }

  return { supported: false };
};

export const vibrate = (pattern: HapticPattern): boolean => {
  const capabilities = checkHapticSupport();

  if (!capabilities.supported) {
    return false;
  }

  try {
    if (capabilities.vendor === 'webkit' && 'webkitVibrate' in navigator) {
      (
        navigator as Navigator & {
          webkitVibrate: (pattern: HapticPattern) => boolean;
        }
      ).webkitVibrate(pattern);
      return true;
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
      return true;
    }

    return false;
  } catch (error) {
    console.warn('Haptic feedback error:', error);
    return false;
  }
};

export const vibrateSuccess = (): boolean => {
  return vibrate(200);
};

export const vibrateError = (): boolean => {
  return vibrate([100, 50, 100]);
};

export const vibrateWarning = (): boolean => {
  return vibrate(50);
};

export const stopVibration = (): boolean => {
  return vibrate(0);
};
