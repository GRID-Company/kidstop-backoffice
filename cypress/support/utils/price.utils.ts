export const parsePrice = (priceText: string): number => {
  return parseFloat(priceText.replace('$', '').replace(',', ''));
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
