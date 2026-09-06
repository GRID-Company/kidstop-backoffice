import { z } from 'zod';

export const extractedFieldSchema = z.object({
  value: z.union([z.string(), z.number(), z.null()]),
  normalizedValue: z.union([z.string(), z.number(), z.null()]),
  confidence: z.number().min(0).max(1),
  sourceRegions: z.array(z.string()),
  rawMatches: z.array(z.string()),
});

export const scanConfidenceSchema = z.object({
  captureQuality: z.number().min(0).max(1),
  ocrQuality: z.number().min(0).max(1),
  extractionQuality: z.number().min(0).max(1),
  overall: z.number().min(0).max(1),
});

export const extractedCardDataSchema = z.object({
  name: extractedFieldSchema,
  collectorNumber: extractedFieldSchema,
  printedTotal: extractedFieldSchema,
  setCode: extractedFieldSchema,
  setSymbol: extractedFieldSchema,
  hp: extractedFieldSchema,
  rarity: extractedFieldSchema,
  language: extractedFieldSchema,
  printedYear: extractedFieldSchema,
});

export const cardSearchRequestSchema = z.object({
  schemaVersion: z.literal('1.0'),
  game: z.enum(['pokemon', 'magic', 'unknown']),
  scan: z.object({
    capturedAt: z.string(),
    orientation: z.enum(['portrait', 'landscape']),
    layout: z.string().nullable(),
    captureQuality: z.number().min(0).max(1),
    ocrQuality: z.number().min(0).max(1),
    extractionQuality: z.number().min(0).max(1),
  }),
  fields: extractedCardDataSchema,
  rawOcr: z.object({
    fullText: z.string(),
    regions: z.record(
      z.string(),
      z.object({
        text: z.string(),
        averageConfidence: z.number().nullable(),
      })
    ),
  }),
});

export const cardCandidateSchema = z.object({
  id: z.string(),
  game: z.enum(['pokemon', 'magic']),
  name: z.string(),
  setName: z.string().nullable(),
  collectorNumber: z.string().nullable(),
  imageUrl: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  matchedBy: z.array(z.string()),
});

export const cardSearchResponseSchema = z.object({
  candidates: z.array(cardCandidateSchema),
});

export type ExtractedFieldSchema = z.infer<typeof extractedFieldSchema>;
export type ScanConfidenceSchema = z.infer<typeof scanConfidenceSchema>;
export type ExtractedCardDataSchema = z.infer<typeof extractedCardDataSchema>;
export type CardSearchRequestSchema = z.infer<typeof cardSearchRequestSchema>;
export type CardCandidateSchema = z.infer<typeof cardCandidateSchema>;
export type CardSearchResponseSchema = z.infer<typeof cardSearchResponseSchema>;
