export const OFFER_PRICE_PERCENTAGE = 0.6;
export const PUBLIC_PRICE_MARKUP = 0.2;

export const roundUpToMultipleOf5 = (value: number): number => {
  return Math.ceil(value / 5) * 5;
};

export const calculateOfferPrice = (referencePrice: number): number => {
  const basePrice = Math.floor(referencePrice * OFFER_PRICE_PERCENTAGE);
  return roundUpToMultipleOf5(basePrice);
};

export const calculatePublicPrice = (referencePrice: number): number => {
  const basePrice = Math.ceil(referencePrice * (1 + PUBLIC_PRICE_MARKUP));
  return roundUpToMultipleOf5(basePrice);
};
