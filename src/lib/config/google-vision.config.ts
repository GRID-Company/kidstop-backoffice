import { z } from 'zod';

const googleVisionEnvSchema = z.object({
  GOOGLE_CLOUD_PROJECT_ID: z
    .string()
    .min(1, 'GOOGLE_CLOUD_PROJECT_ID is required'),
  GOOGLE_CLOUD_CLIENT_EMAIL: z
    .string()
    .email('GOOGLE_CLOUD_CLIENT_EMAIL must be a valid email')
    .min(1, 'GOOGLE_CLOUD_CLIENT_EMAIL is required'),
  GOOGLE_CLOUD_PRIVATE_KEY: z
    .string()
    .min(1, 'GOOGLE_CLOUD_PRIVATE_KEY is required')
    .refine(
      (key) =>
        key.includes('BEGIN PRIVATE KEY') ||
        /^[A-Za-z0-9+/=\s]+$/.test(key.trim().replace(/^["']+|["']+$/g, '')),
      'GOOGLE_CLOUD_PRIVATE_KEY must be a PEM private key or base64-encoded PEM'
    ),
});

export type GoogleVisionConfig = z.infer<typeof googleVisionEnvSchema>;

export function validateGoogleVisionConfig(): GoogleVisionConfig {
  const config = {
    GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
    GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  };

  try {
    return googleVisionEnvSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n');
      throw new Error(
        `Google Vision API configuration error:\n${missingVars}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}
