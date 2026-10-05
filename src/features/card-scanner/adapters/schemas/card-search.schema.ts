import { z } from 'zod';

export const cardScanSearchInputSchema = z
  .object({
    name: z.string().optional().nullable(),
    cardNumber: z.string().optional().nullable(),
    setCode: z.string().optional().nullable(),
    text: z.string().optional().nullable(),
    originalImage: z.instanceof(File).optional().nullable(),
    setIcon: z.instanceof(File).optional().nullable(),
    aiSearchOnly: z.boolean().optional().nullable(),
    withCardsMetrics: z.boolean().optional().nullable(),
  })
  .refine(
    (input) =>
      Boolean(input.name) ||
      Boolean(input.cardNumber) ||
      Boolean(input.setCode) ||
      Boolean(input.text) ||
      Boolean(input.originalImage),
    { message: 'Se requiere al menos un campo de texto o una imagen' }
  );
