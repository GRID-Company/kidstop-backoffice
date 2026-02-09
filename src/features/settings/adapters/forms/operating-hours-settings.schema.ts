import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeSlotSchema = z
  .object({
    open: z.string().regex(timeRegex, 'Formato inválido (HH:mm)'),
    close: z.string().regex(timeRegex, 'Formato inválido (HH:mm)'),
  })
  .refine((data) => data.open < data.close, {
    message: 'La hora de cierre debe ser posterior a la de apertura',
    path: ['close'],
  });

const daySlotSchema = z.union([timeSlotSchema, z.null()]);

export const operatingHoursSettingsSchema = z.object({
  monday: daySlotSchema,
  tuesday: daySlotSchema,
  wednesday: daySlotSchema,
  thursday: daySlotSchema,
  friday: daySlotSchema,
  saturday: daySlotSchema,
  sunday: daySlotSchema,
});

export type OperatingHoursSettingsFormData = z.infer<typeof operatingHoursSettingsSchema>;
