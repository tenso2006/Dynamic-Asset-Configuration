import { z } from 'zod';
import type { AssetType } from '../types/asset';

export const transformerSchema = z.object({
  kvaRating: z.coerce
    .number({ invalid_type_error: 'kVA Rating must be a number' })
    .positive('kVA Rating must be a positive number'),
  coolingType: z.enum(['ONAN', 'ONAF'], {
    errorMap: () => ({ message: 'Please select a cooling type' }),
  }),
});

export const sectionSchema = z.object({
  groundedNeutral: z.boolean(),
  conductorType: z
    .string()
    .min(3, 'Conductor type must be at least 3 characters'),
});

const schemaMap = {
  TRANSFORMER: transformerSchema,
  SECTION: sectionSchema,
  BREAKER: z.object({}),
} satisfies Record<AssetType, z.ZodTypeAny>;

export function getSchema(assetType: AssetType): z.ZodTypeAny {
  return schemaMap[assetType];
}
