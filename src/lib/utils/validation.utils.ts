export const isValidPrice = (
  price: number | undefined | null
): price is number => {
  return typeof price === 'number' && price > 0 && !isNaN(price);
};

export const isValidQuantity = (
  quantity: number | undefined | null
): quantity is number => {
  return typeof quantity === 'number' && quantity > 0 && !isNaN(quantity);
};
