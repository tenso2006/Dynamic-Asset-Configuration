# Development Guide

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server at http://localhost:5173 |
| `npm test` | Run tests in watch mode (Vitest) |
| `npm run test:ui` | Open Vitest browser UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run build` | Production build |

## Project structure

```
src/
├── test/
│   └── setup.ts                  # Vitest global setup (jest-dom matchers)
├── types/
│   └── asset.ts                  # All TypeScript types (inferred from schemas)
├── schemas/
│   └── assetSchemas.ts           # Zod validation schemas + getSchema()
├── config/
│   └── fieldConfig.ts            # Field descriptor config per asset type
├── pages/                        # All pages kept here
|   └── DynamicAssetFormPage/     
|       └── DynamicAssetFormPage.tsx/     
|       └── DynamicAssetFormPage.spec.tsx/     
├── components/
│   └── DynamicAssetForm/
│       ├── __test__
|           ├── TextInputField.spec.tsx
|           ├── SelectField.spec.tsx
|           ├── SwitchField.spec.tsx
│       ├── DynamicAssetForm.tsx  # Main form component
│       ├── DynamicAssetForm.spec.tsx
│       └── fields/
│           ├── TextInputField.tsx
│           ├── SelectField.tsx
│           └── SwitchField.tsx
└── App.tsx                       # Demo: asset type picker + form + payload display
docs/
├── ARCHITECTURE.md               # Design decision log
├── FLOW.md                       # Step-by-step data flow
└── DEVELOPMENT.md                # This file
```

## Running tests

```bash
# All tests once
npm test -- --run

# Watch mode
npm test

# Verbose (see individual test names)
npm test -- --reporter=verbose
```

All tests are in next to each tsx pages or components with implementation (TDD) and cover:

- Field rendering per asset type
- Validation errors for each invalid input scenario
- Correct typed payload shape on valid submit

## Adding a new asset type

1. **Schema** — add `myTypeSchema` to `src/schemas/assetSchemas.ts` and add it to `schemaMap`.
2. **Types** — add a new branch to the `AssetFormPayload` union in `src/types/asset.ts`.
3. **Config** — add a field descriptor array to `fieldConfig` in `src/config/fieldConfig.ts`.
4. **Tests** — add a `describe` block in `DynamicAssetForm.test.tsx` before writing the config.

No changes needed to `DynamicAssetForm.tsx` or the field components.

## Tech stack

| Library | Version | Role |
|---|---|---|
| React | 18 | UI rendering |
| TypeScript | 5 (strict) | Type safety |
| Vite | 6 | Dev server + bundler |
| MUI | 6 | UI component library |
| react-hook-form | 7 | Form state management |
| Zod | 3 | Schema definition + validation |
| @hookform/resolvers | 3 | Bridges Zod ↔ react-hook-form |
| Vitest | 2 | Test runner |
| @testing-library/react | 16 | Component testing utilities |
| @testing-library/user-event | 14 | Realistic user interaction simulation |
