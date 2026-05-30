import { validatePhoneNumber, normalizePhoneNumber, validateAndNormalizePhone } from '../phone-validation';

describe('validatePhoneNumber', () => {
  describe('Valid phone numbers', () => {
    it('accepts 10-digit format', () => {
      expect(validatePhoneNumber('5512345678')).toBe(true);
    });

    it('accepts 10-digit with formatting', () => {
      expect(validatePhoneNumber('55 1234 5678')).toBe(true);
    });

    it('accepts 52 prefix format', () => {
      expect(validatePhoneNumber('5255123456789')).toBe(true);
    });

    it('accepts +52 prefix format', () => {
      expect(validatePhoneNumber('+5255123456789')).toBe(true);
    });

    it('accepts +52 with formatting', () => {
      expect(validatePhoneNumber('+52 55 1234 5678')).toBe(true);
    });

    it('accepts 11-digit format', () => {
      expect(validatePhoneNumber('15512345678')).toBe(true);
    });
  });

  describe('Invalid phone numbers', () => {
    it('rejects empty string', () => {
      expect(validatePhoneNumber('')).toBe(false);
    });

    it('rejects null', () => {
      expect(validatePhoneNumber(null as any)).toBe(false);
    });

    it('rejects undefined', () => {
      expect(validatePhoneNumber(undefined as any)).toBe(false);
    });

    it('rejects less than 10 digits', () => {
      expect(validatePhoneNumber('551234567')).toBe(false);
    });

    it('rejects 52 prefix with less than 12 digits', () => {
      expect(validatePhoneNumber('5255123456')).toBe(false);
    });

    it('rejects non-numeric characters only', () => {
      expect(validatePhoneNumber('abc-def-ghij')).toBe(false);
    });
  });
});

describe('normalizePhoneNumber', () => {
  it('normalizes 10-digit format to 52 prefix', () => {
    expect(normalizePhoneNumber('5512345678')).toBe('5255123456789');
  });

  it('keeps 52 prefix format unchanged', () => {
    expect(normalizePhoneNumber('5255123456789')).toBe('5255123456789');
  });

  it('removes formatting and adds 52 prefix', () => {
    expect(normalizePhoneNumber('55 1234 5678')).toBe('5255123456789');
  });

  it('removes + symbol and keeps 52 prefix', () => {
    expect(normalizePhoneNumber('+5255123456789')).toBe('5255123456789');
  });

  it('returns empty string for empty input', () => {
    expect(normalizePhoneNumber('')).toBe('');
  });

  it('returns partial digits if less than 10', () => {
    expect(normalizePhoneNumber('551234')).toBe('551234');
  });
});

describe('validateAndNormalizePhone', () => {
  it('validates normalized phone', () => {
    expect(validateAndNormalizePhone('5512345678')).toBe(true);
  });

  it('validates 52 prefix phone', () => {
    expect(validateAndNormalizePhone('5255123456789')).toBe(true);
  });

  it('rejects invalid phone after normalization', () => {
    expect(validateAndNormalizePhone('551234')).toBe(false);
  });

  it('handles formatted input', () => {
    expect(validateAndNormalizePhone('+52 55 1234 5678')).toBe(true);
  });
});
