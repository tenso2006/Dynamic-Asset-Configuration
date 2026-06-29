import type { AssetType, FieldDescriptor } from '../types/asset';

export const fieldConfig: Record<AssetType, FieldDescriptor[]> = {
  TRANSFORMER: [
    { name: 'kvaRating', label: 'kVA Rating', type: 'text' },
    {
      name: 'coolingType',
      label: 'Cooling Type',
      type: 'select',
      options: [
        { label: 'ONAN', value: 'ONAN' },
        { label: 'ONAF', value: 'ONAF' },
      ],
    },
  ],
  SECTION: [
    { name: 'groundedNeutral', label: 'Grounded Neutral', type: 'switch' },
    { name: 'conductorType', label: 'Conductor Type', type: 'text' },
  ],
  BREAKER: [],
};
