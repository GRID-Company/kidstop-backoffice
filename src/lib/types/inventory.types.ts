export enum ColorKey {
  ALL = 'ALL',
  WHITE = 'WHITE',
  CHOCOLATE = 'CHOCOLATE',
  CRUDE = 'CRUDE',
  ELECTRO = 'ELECTRO',
  EUROPE_GRAY = 'EUROPE_GRAY',
  BONE = 'BONE',
  WOOD = 'WOOD',
  WALNUT = 'WALNUT',
}

export enum ColorLabel {
  ALL = 'Todos los colores',
  WHITE = 'Blanco',
  CHOCOLATE = 'Chocolate',
  CRUDE = 'Crudo',
  ELECTRO = 'Electro',
  EUROPE_GRAY = 'Gris Europa',
  BONE = 'Hueso',
  WOOD = 'Madera',
  WALNUT = 'Nogal',
}

export enum ColorHex {
  ALL = 'transparent',
  WHITE = '#FFFFFF',
  CHOCOLATE = '#1A1204',
  CRUDE = '#A6A6A6',
  ELECTRO = '#99856A',
  EUROPE_GRAY = '#54534D',
  BONE = '#E9E2C5',
  WOOD = 'transparent',
  WALNUT = 'transparent',
}

export interface ColorItem {
  value: ColorKey;
  label: ColorLabel;
}

export const ColorOptions = Object.entries(ColorLabel).map(([key, label]) => ({
  value: key,
  label,
}));
