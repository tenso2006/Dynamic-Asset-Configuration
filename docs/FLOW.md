# Data Flow — Dynamic Asset Configuration Form

This document traces the complete lifecycle of a form interaction, from prop to typed payload.

---

## 1. Asset type selection

The parent (`App.tsx`) holds `assetType` in state and passes it as a prop:

```tsx
<DynamicAssetFormPage assetType="TRANSFORMER" onSubmit={handleSubmit} />
```

---

## 2. Schema selection

Inside `DynamicAssetForm`, the first thing that happens is schema selection:

```ts
// src/schemas/assetSchemas.ts
const schemaMap = {
  TRANSFORMER: transformerSchema,
  SECTION: sectionSchema,
  BREAKER: z.object({}),
};

export function getSchema(assetType: AssetType) {
  return schemaMap[assetType];
}
```

```ts
// DynamicAssetForm.tsx
const methods = useForm({
  resolver: zodResolver(getSchema(assetType)),
});
```

`zodResolver` plugs the selected Zod schema into react-hook-form. From this point on, react-hook-form delegates all validation to Zod.

---

## 3. Field rendering

The form looks up the field list in `fieldConfig[assetType]` and maps each descriptor to its component:

```
fieldConfig['TRANSFORMER']
→ [{ type: 'text', name: 'kvaRating', ... }, { type: 'select', name: 'coolingType', ... }]
→ renders: <TextInputField />, <SelectField />
```

Each field registers itself with the form via `Controller` + `useFormContext`. The form tracks `value`, `isDirty`, `error` per field.

---

## 4. User input

As the user types or selects:

- `Controller` calls `field.onChange` on each keystroke / click.
- react-hook-form updates its internal store (not React state — this is why the form stays performant with many fields).
- In `mode: 'onSubmit'`, validation does **not** run yet. Error messages stay hidden.

---

## 5. Submit attempt

When the user clicks **Submit**:

```
Button[type="submit"] clicked
→ HTML form's submit event fires
→ react-hook-form intercepts via handleSubmit
→ Zod schema validates all field values
```

**If validation fails:** Zod returns field-level errors. react-hook-form stores them in `formState.errors`. Each `Controller` reads `fieldState.error` and passes it to the MUI component as `error` + `helperText`. The submit callback is **not** called.

**If validation passes:** react-hook-form calls the success handler.

---

## 6. Typed payload assembly

```ts
// DynamicAssetForm.tsx
const handleSubmit = methods.handleSubmit((data) => {
  onSubmit({ assetType, ...data } as AssetFormPayload);
});
```

`data` is what Zod produced after validation — already coerced (e.g. `kvaRating` is `number`, not `"100"`). We spread it with `assetType` to produce the discriminated union payload.

---

## 7. Asset type change

When `assetType` changes (user picks a different type), `useEffect` fires:

```ts
useEffect(() => {
  methods.reset();
}, [assetType, methods]);
```

This clears all field values and errors, then `useForm` re-initialises with the new schema (via a key-based re-render triggered by `zodResolver` receiving a new schema reference). The user sees a clean form for the new type.

---

## Full sequence diagram

```
User selects TRANSFORMER
       │
       ▼
App.tsx sets assetType = 'TRANSFORMER'
       │
       ▼
DynamicAssetFormPage receives prop
  ├── getSchema('TRANSFORMER') → transformerSchema
  ├── useForm({ resolver: zodResolver(transformerSchema) })
  └── fieldConfig['TRANSFORMER'] → renders kvaRating + coolingType fields
       │
User types "100" in kvaRating, selects "ONAN" in coolingType
       │
       ▼
User clicks Submit
  ├── zodResolver runs transformerSchema.parse({ kvaRating: "100", coolingType: "ONAN" })
  │     z.coerce.number() converts "100" → 100
  │     z.enum validates "ONAN" ✓
  └── onSubmit({ assetType: 'TRANSFORMER', kvaRating: 100, coolingType: 'ONAN' })
       │
       ▼
Parent receives AssetFormPayload (fully typed, discriminated)
```
