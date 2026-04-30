import { formatCurrency } from './format-currency';

export const REDACTED_VALUE = '$••••••';

export const formatCurrencyWithPrivacy = (
  value: number,
  isPrivacyMode: boolean
): string => {
  return isPrivacyMode ? REDACTED_VALUE : formatCurrency(value);
};
