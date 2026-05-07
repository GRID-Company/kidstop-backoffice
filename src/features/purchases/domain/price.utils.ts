export const OFFER_PRICE_PERCENTAGE = 0.6;
export const PUBLIC_PRICE_MARKUP = 0.20;

export const calculateOfferPrice = (referencePrice: number): number => {
  return Math.floor(referencePrice * OFFER_PRICE_PERCENTAGE);
};

export const calculatePublicPrice = (referencePrice: number): number => {
  return Math.ceil(referencePrice * (1 + PUBLIC_PRICE_MARKUP));
};
