import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const bannerFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: 'El archivo debe ser menor a 5MB',
  })
  .refine((file) => ALLOWED_MIME_TYPES.includes(file.type), {
    message: 'Solo se permiten archivos JPG, PNG o WebP',
  });

export const bannerSettingsSchema = z.object({
  pokemonFile: bannerFileSchema.optional(),
  magicFile: bannerFileSchema.optional(),
});

export type BannerSettingsFormData = z.infer<typeof bannerSettingsSchema>;
