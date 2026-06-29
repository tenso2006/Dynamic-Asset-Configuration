# Architecture — Dynamic Asset Configuration Form

## Why this exists

The challenge requires a single form component that changes its field set based on an `assetType` prop. Each asset type has its own validation rules and its own TypeScript payload shape. The core design problem is: **how do you keep the type system, validation, and rendering in sync without duplicating code?**

---

## Decision 1 — Schema-first with inferred TypeScript types

**What we do:** Zod schemas are the single source of truth. TypeScript types are derived with `z.infer<>`.

```ts
// src/schemas/assetSchemas.ts
export const transformerSchema = z.object({
  kvaRating: z.coerce.number().positive('kVA Rating must be a positive number'),
  coolingType: z.enum(['ONAN', 'ONAF']),
});

// src/types/asset.ts
export type TransformerFormData = z.infer<typeof transformerSchema>;
// → { kvaRating: number; coolingType: 'ONAN' | 'ONAF' }
```

**Why not define interfaces separately?** Defining `interface TransformerFormData` alongside a Zod schema creates two sources of truth that can silently drift — the interface can say `kvaRating: string` while the schema validates it as a number, and TypeScript won't notice. One source eliminates the whole class of bugs.

---

## Decision 2 — Discriminated union for the submit payload

```ts
export type AssetFormPayload =
  | ({ assetType: 'TRANSFORMER' } & TransformerFormData)
  | ({ assetType: 'SECTION' } & SectionFormData);
```

**Why a discriminated union?** The `onSubmit` callback is typed `(payload: AssetFormPayload) => void`. A caller can then narrow:

```ts
function handleSubmit(payload: AssetFormPayload) {
  if (payload.assetType === 'TRANSFORMER') {
    // TypeScript knows payload.kvaRating is number here
  }
}
```

This is zero-cost at runtime (no class, no instanceof check) and gives full compile-time narrowing. The alternative — `Record<string, unknown>` or `any` — loses all type safety the moment the payload leaves the form.

---

## Decision 3 — Config-driven field rendering

```ts
// src/config/fieldConfig.ts
export const fieldConfig: Record<AssetType, FieldDescriptor[]> = {
  TRANSFORMER: [
    { name: 'kvaRating', label: 'kVA Rating', type: 'text' },
    { name: 'coolingType', label: 'Cooling Type', type: 'select', options: [...] },
  ],
  SECTION: [...],
  BREAKER: [],
};
```

**Why config over if/else?** Adding a new asset type — say `BREAKER` with fields — requires only two things:

1. Add its Zod schema to `assetSchemas.ts`.
2. Add its field array to `fieldConfig.ts`.

No changes to `DynamicAssetForm.tsx`, no new branch in a render function, no risk of forgetting to handle a case. The form component stays closed to modification and open to extension.

**Why `FieldDescriptor` with a discriminated union?** The `type` field (`'text' | 'select' | 'switch'`) lets the renderer switch on `field.type` and TypeScript narrows the descriptor — so `SelectFieldDescriptor` is the only type that has an `options` property, and the compiler enforces this.

---

## Decision 4 — FormProvider + Controller pattern

Each field component (`TextInputField`, `SelectField`, `SwitchField`) receives its field `name` and `label` as props and reads the form context via `useFormContext()`. The `Controller` wrapper bridges MUI's controlled input API with react-hook-form's uncontrolled-first model.

**Why not `register` + `ref`?** MUI components don't expose a DOM ref compatible with `register`. `Controller` gives full control over `value`, `onChange`, and `onBlur` without patching the component's internals.

---

## Decision 5 — `z.coerce.number()` for numeric text input

HTML `<input type="text">` always produces a string. Using `z.coerce.number()` converts the string to a number at the Zod validation boundary, so the `kvaRating` field in the submitted payload is typed and valued as `number` — not `"100"` (a string) that happens to look like one.

---

## Directory layout rationale

```
src/
├── types/       ← Shared TypeScript types only, no logic
├── schemas/     ← Zod schemas (validation rules)
├── config/      ← Field descriptor config (what to render)
├── pages/       ← All pages kept here as folder with its test
└── components/  ← All reusable components
    └── DynamicAssetForm/
        ├── DynamicAssetForm.tsx   ← Orchestrates form lifecycle
        ├── DynamicAssetForm.spec.tsx
        └── fields/                ← Stateless, reusable field components
```

Keeping `types`, `schemas`, and `config` separate makes it easy to reason about each layer in isolation. The form component imports all three but none of them import each other.
