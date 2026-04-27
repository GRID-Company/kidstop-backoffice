export const OFFER_PRICE_PERCENTAGE = 0.6;

export const calculateOfferPrice = (referencePrice: number): number => {
  return Math.floor(referencePrice * OFFER_PRICE_PERCENTAGE);
};
