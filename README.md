# Dynamic Asset Configuration

A React + TypeScript + Vite application for configuring asset forms for different asset types such as Transformer, Section, and Breaker. The app uses Material UI, React Hook Form, Zod, and Vitest.

## Prerequisites

Make sure you have the following installed locally:

- Node.js 18 or newer
- npm 9 or newer

## Getting started

1. Clone the repository and move into the project folder:

   ```bash
   cd Dynamic-Asset-Configuration
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser at the local Vite URL shown in the terminal, usually:

   ```text
   http://localhost:5173
   ```

## Available scripts

- `npm run dev` - Start the local Vite development server
- `npm run build` - Create a production build
- `npm run preview` - Preview the production build locally
- `npm run test` - Run the Vitest test suite
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run test:ui` - Open the Vitest UI
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues

## Project structure

- `src/App.tsx` - Main app shell with asset type tabs
- `src/pages/DynamicAssetFormPage/` - Dynamic form page for each asset type
- `src/components/DynamicAssetForm/fields/` - Reusable form field components
- `src/config/fieldConfig.ts` - Field definitions for each asset type
- `src/schemas/assetSchemas.ts` - Form validation schemas
- `src/test/` - Test setup and shared test utilities

## Testing

Run the test suite with:

```bash
npm test
```

To run a single test file:

```bash
npm run test -- --run src/App.spec.tsx
```

## Troubleshooting

- If Vite reports that port `5173` is already in use, it will automatically choose the next available port.
- If dependencies are not installed correctly, delete `node_modules` and `package-lock.json` and run `npm install` again.
- If you see TypeScript or lint errors after pulling updates, run `npm install` and `npm run typecheck`.

