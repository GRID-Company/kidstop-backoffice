export const uniqueSuffix = (): string => `${Date.now()}`;

export const uniqueName = (base: string): string => `${base} ${uniqueSuffix()}`;

export const uniqueEmail = (base = 'kidstop+cypress.e2e'): string =>
  `${base}.${uniqueSuffix()}@gmail.com`;

export const uniquePhone = (): string => `52${uniqueSuffix().slice(-10)}`;
