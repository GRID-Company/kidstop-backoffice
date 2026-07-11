export const OFFER_PRICE_PERCENTAGE = 0.6;
export const PUBLIC_PRICE_MARKUP = 0.2;

/**
 * Rounds a number up to the next multiple of 5
 * @param value - The number to round
 * @returns The rounded value (always >= input, 0 for negative values)
 * @example roundUpToMultipleOf5(12) // returns 15
 * @example roundUpToMultipleOf5(5) // returns 5
 * @example roundUpToMultipleOf5(0) // returns 0
 */
export const roundUpToMultipleOf5 = (value: number): number => {
  if (value < 0) return 0;
  return Math.ceil(value / 5) * 5;
};

/**
 * Calculates the offer price (purchase price) based on reference price
 * Applies OFFER_PRICE_PERCENTAGE and rounds up to next multiple of 5
 * @param referencePrice - The reference price from catalog
 * @returns Calculated offer price rounded to next multiple of 5
 */
export const calculateOfferPrice = (referencePrice: number): number => {
  const basePrice = Math.floor(referencePrice * OFFER_PRICE_PERCENTAGE);
  return roundUpToMultipleOf5(basePrice);
};

/**
 * Calculates the public price (sale price) based on reference price
 * Applies PUBLIC_PRICE_MARKUP and rounds up to next multiple of 5
 * @param referencePrice - The reference price from catalog
 * @returns Calculated public price rounded to next multiple of 5
 */
export const calculatePublicPrice = (referencePrice: number): number => {
  const basePrice = Math.ceil(referencePrice * (1 + PUBLIC_PRICE_MARKUP));
  return roundUpToMultipleOf5(basePrice);
};
