import { z } from 'zod';
import { MOST_WANTED_PRIORITIES } from '../../domain/types';

const priorityValues = Object.values(MOST_WANTED_PRIORITIES) as [string, ...string[]];

export const mostWantedCardFormSchema = z.object({
  cardId: z.string().min(1, 'La carta es obligatoria'),
  priority: z.enum(priorityValues, {
    message: 'La prioridad es obligatoria',
  }),
  notes: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').default(''),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().min(0, 'El orden debe ser mayor o igual a 0').default(0),
});

export type MostWantedCardFormData = z.infer<typeof mostWantedCardFormSchema>;
