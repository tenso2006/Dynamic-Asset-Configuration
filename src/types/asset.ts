import type { z } from 'zod';
import type { transformerSchema, sectionSchema } from '../schemas/assetSchemas';

export type AssetType = 'TRANSFORMER' | 'SECTION' | 'BREAKER';

export type TransformerFormData = z.infer<typeof transformerSchema>;
export type SectionFormData = z.infer<typeof sectionSchema>;

export type AssetFormPayload =
  | ({ assetType: 'TRANSFORMER' } & TransformerFormData)
  | ({ assetType: 'SECTION' } & SectionFormData);

export type SelectOption = { label: string; value: string };
export type FieldType = 'text' | 'select' | 'switch';

export interface BaseFieldDescriptor {
  name: string;
  label: string;
  type: FieldType;
}

export interface TextFieldDescriptor extends BaseFieldDescriptor {
  type: 'text';
}

export interface SelectFieldDescriptor extends BaseFieldDescriptor {
  type: 'select';
  options: SelectOption[];
}

export interface SwitchFieldDescriptor extends BaseFieldDescriptor {
  type: 'switch';
}

export type FieldDescriptor =
  | TextFieldDescriptor
  | SelectFieldDescriptor
  | SwitchFieldDescriptor;
