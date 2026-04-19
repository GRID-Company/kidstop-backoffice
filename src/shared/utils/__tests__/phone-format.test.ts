import { formatPhoneNumber } from '../phone-format';

describe('formatPhoneNumber', () => {
  describe('10-digit format', () => {
    it('formats 10-digit number', () => {
      expect(formatPhoneNumber('5512345678')).toBe('+52 55 1234 5678');
    });

    it('formats 10-digit with spaces', () => {
      expect(formatPhoneNumber('55 1234 5678')).toBe('+52 55 1234 5678');
    });

    it('formats 10-digit with dashes', () => {
      expect(formatPhoneNumber('55-1234-5678')).toBe('+52 55 1234 5678');
    });

    it('formats 10-digit with mixed formatting', () => {
      expect(formatPhoneNumber('55 1234-5678')).toBe('+52 55 1234 5678');
    });
  });

  describe('52 prefix format', () => {
    it('formats 52 prefix number (12 digits)', () => {
      expect(formatPhoneNumber('5255123456789')).toBe('+52 55 1234 5678');
    });

    it('formats +52 prefix number', () => {
      expect(formatPhoneNumber('+5255123456789')).toBe('+52 55 1234 5678');
    });

    it('formats +52 with spaces', () => {
      expect(formatPhoneNumber('+52 55 1234 5678')).toBe('+52 55 1234 5678');
    });

    it('formats 52 prefix with longer number', () => {
      expect(formatPhoneNumber('525512345678901')).toBe('+52 55 1234 5678');
    });
  });

  describe('Progressive formatting', () => {
    it('formats 1 digit', () => {
      expect(formatPhoneNumber('5')).toBe('5');
    });

    it('formats 2 digits', () => {
      expect(formatPhoneNumber('55')).toBe('55');
    });

    it('formats 3 digits', () => {
      expect(formatPhoneNumber('551')).toBe('55 1');
    });

    it('formats 4 digits', () => {
      expect(formatPhoneNumber('5512')).toBe('55 12');
    });

    it('formats 5 digits', () => {
      expect(formatPhoneNumber('55123')).toBe('55 123');
    });

    it('formats 6 digits', () => {
      expect(formatPhoneNumber('551234')).toBe('55 123 4');
    });

    it('formats 9 digits', () => {
      expect(formatPhoneNumber('551234567')).toBe('55 123 4567');
    });
  });

  describe('Edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(formatPhoneNumber('')).toBe('');
    });

    it('returns empty string for null', () => {
      expect(formatPhoneNumber(null as any)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(formatPhoneNumber(undefined as any)).toBe('');
    });

    it('handles only non-numeric characters', () => {
      expect(formatPhoneNumber('abc-def-ghij')).toBe('');
    });

    it('handles mixed alphanumeric', () => {
      expect(formatPhoneNumber('55a123b4567')).toBe('55 123 4567');
    });

    it('handles special characters', () => {
      expect(formatPhoneNumber('(55) 1234-5678')).toBe('+52 55 1234 5678');
    });
  });

  describe('International format', () => {
    it('formats with + symbol', () => {
      expect(formatPhoneNumber('+525512345678')).toBe('+52 55 1234 5678');
    });

    it('formats with country code 52', () => {
      expect(formatPhoneNumber('525512345678')).toBe('+52 55 1234 5678');
    });
  });
});
