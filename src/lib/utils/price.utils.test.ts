import {
  roundUpToMultipleOf5,
  calculateOfferPrice,
  calculatePublicPrice,
  OFFER_PRICE_PERCENTAGE,
  PUBLIC_PRICE_MARKUP,
} from './price.utils';

describe('price.utils', () => {
  describe('roundUpToMultipleOf5', () => {
    it('should return 0 for 0', () => {
      expect(roundUpToMultipleOf5(0)).toBe(0);
    });

    it('should round up to 5 for values between 1 and 5', () => {
      expect(roundUpToMultipleOf5(1)).toBe(5);
      expect(roundUpToMultipleOf5(2)).toBe(5);
      expect(roundUpToMultipleOf5(3)).toBe(5);
      expect(roundUpToMultipleOf5(4)).toBe(5);
    });

    it('should return same value if already multiple of 5', () => {
      expect(roundUpToMultipleOf5(5)).toBe(5);
      expect(roundUpToMultipleOf5(10)).toBe(10);
      expect(roundUpToMultipleOf5(15)).toBe(15);
      expect(roundUpToMultipleOf5(100)).toBe(100);
    });

    it('should round up to next multiple of 5', () => {
      expect(roundUpToMultipleOf5(6)).toBe(10);
      expect(roundUpToMultipleOf5(11)).toBe(15);
      expect(roundUpToMultipleOf5(23)).toBe(25);
      expect(roundUpToMultipleOf5(99)).toBe(100);
    });

    it('should handle decimal values', () => {
      expect(roundUpToMultipleOf5(12.5)).toBe(15);
      expect(roundUpToMultipleOf5(7.1)).toBe(10);
      expect(roundUpToMultipleOf5(4.9)).toBe(5);
    });

    it('should return 0 for negative values', () => {
      expect(roundUpToMultipleOf5(-1)).toBe(0);
      expect(roundUpToMultipleOf5(-5)).toBe(0);
      expect(roundUpToMultipleOf5(-10)).toBe(0);
    });
  });

  describe('calculateOfferPrice', () => {
    it('should calculate and round offer price correctly', () => {
      expect(calculateOfferPrice(100)).toBe(60);
    });

    it('should apply floor before rounding', () => {
      expect(calculateOfferPrice(10)).toBe(10);
    });

    it('should round up to next multiple of 5', () => {
      expect(calculateOfferPrice(20)).toBe(15);
    });

    it('should handle large values', () => {
      const referencePrice = 1000;
      const expected = roundUpToMultipleOf5(
        Math.floor(referencePrice * OFFER_PRICE_PERCENTAGE)
      );
      expect(calculateOfferPrice(referencePrice)).toBe(expected);
    });

    it('should return 0 for 0 reference price', () => {
      expect(calculateOfferPrice(0)).toBe(0);
    });
  });

  describe('calculatePublicPrice', () => {
    it('should calculate and round public price correctly', () => {
      expect(calculatePublicPrice(100)).toBe(120);
    });

    it('should apply ceiling before rounding', () => {
      expect(calculatePublicPrice(10)).toBe(15);
    });

    it('should round up to next multiple of 5', () => {
      expect(calculatePublicPrice(20)).toBe(25);
    });

    it('should handle large values', () => {
      const referencePrice = 1000;
      const expected = roundUpToMultipleOf5(
        Math.ceil(referencePrice * (1 + PUBLIC_PRICE_MARKUP))
      );
      expect(calculatePublicPrice(referencePrice)).toBe(expected);
    });

    it('should return 0 for 0 reference price', () => {
      expect(calculatePublicPrice(0)).toBe(0);
    });
  });

  describe('integration tests', () => {
    it('should maintain relationship: offerPrice < referencePrice < publicPrice', () => {
      const referencePrice = 100;
      const offerPrice = calculateOfferPrice(referencePrice);
      const publicPrice = calculatePublicPrice(referencePrice);

      expect(offerPrice).toBeLessThan(referencePrice);
      expect(publicPrice).toBeGreaterThan(referencePrice);
      expect(offerPrice).toBeLessThan(publicPrice);
    });

    it('should always return multiples of 5', () => {
      const testPrices = [7, 13, 27, 53, 99, 123, 456];

      testPrices.forEach((price) => {
        const offerPrice = calculateOfferPrice(price);
        const publicPrice = calculatePublicPrice(price);

        expect(offerPrice % 5).toBe(0);
        expect(publicPrice % 5).toBe(0);
      });
    });
  });
});
