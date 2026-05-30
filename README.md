# Rango

A custom dual-bullet `<Range />` component built as a React technical test. The component has two independent modes, each served at its own route, with a mocked API, full unit and integration test coverage, and a pre-commit quality gate.

---

## What it does

### Exercise 1 — Normal Range `/exercise1`

- A custom range slider (no `<input type="range">`) with **two draggable bullets**.
- The **min and max labels are editable**: click a label, type a new value, press Enter (or blur) to commit. Press Escape to cancel.
- Values are **clamped** — min can never exceed max and vice versa.
- Bullets **grow and change cursor** on hover (`cursor-grab`) and while dragging (`cursor-grabbing`).
- Fetches `{ min: 1, max: 100 }` from a mocked API endpoint (`GET /api/range`).

### Exercise 2 — Fixed Values Range `/exercise2`

- Same dual-bullet slider, but bullets **snap to a fixed set of values**: `1.99 · 5.99 · 10.99 · 30.99 · 50.99 · 70.99`.
- Labels are **read-only** — no editing allowed.
- Fetches `{ rangeValues: [...] }` from a mocked API endpoint (`GET /api/range-fixed`).

---

## Technology stack

| Layer | Technology |
|---|---|
| **UI framework** | [React 18](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org) |
| **Bundler / dev server** | [Vite 5](https://vitejs.dev) — dev server on `localhost:8080` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` |
| **Routing** | [React Router v6](https://reactrouter.com) |
| **Server state** | [TanStack Query v5](https://tanstack.com/query) — fetching, caching, `staleTime: Infinity` |
| **API mocking** | [MSW v2](https://mswjs.io) — Service Worker in the browser, Node server in tests |
| **Unit tests** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) + [jest-dom](https://github.com/testing-library/jest-dom) |
| **Linter** | [ESLint 9](https://eslint.org) flat config — `typescript-eslint`, `react-hooks`, `react-refresh` |
| **Formatter** | [Prettier](https://prettier.io) — single quotes, no semicolons, 100-char print width |
| **Git hooks** | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) |

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:8080
```

The MSW service worker is registered automatically in dev mode — no extra setup needed.

---

## Available scripts

```bash
npm run dev            # Start development server (port 8080)
npm run build          # Type-check + production build
npm run preview        # Preview the production build locally

npm run test           # Run all tests once (Vitest)
npm run test:watch     # Run tests in watch mode

npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier — rewrite all src files
npm run format:check   # Prettier — check only (used in CI)
```

---

## Project structure

```
src/
├── components/
│   ├── Bullet/          # Draggable bullet — position, cursor, ARIA
│   ├── Label/           # Editable / read-only value label
│   ├── NavBar/          # Top navigation
│   └── Range/           # Composed range slider (normal + fixed modes)
├── hooks/
│   ├── useRange.ts      # Core drag logic, value state, label commit
│   ├── useLabel.ts      # Edit-mode lifecycle for a single label
│   └── useRangeQuery.ts # TanStack Query hooks for both API endpoints
├── pages/
│   ├── Exercise1.tsx    # Normal range page
│   ├── Exercise2.tsx    # Fixed values range page
│   └── NotFound.tsx
├── services/
│   └── rangeApi.ts      # Fetch functions + shared response types
├── mocks/
│   ├── handlers.ts      # MSW request handlers (shared browser + node)
│   ├── browser.ts       # MSW browser worker (dev)
│   └── server.ts        # MSW Node server (tests)
├── utils/
│   ├── rangeUtils.ts    # Pure functions: clamp, snap, percent ↔ value
│   └── constants.tsx    # Nav items
└── test-utils.tsx       # Shared testbed — renderWithProviders + re-exports
```

---

## Testing

```bash
npm test
# 9 test files · 146 tests · all passing
```

Tests are split into three layers:

| Layer | Files | What it covers |
|---|---|---|
| **Unit — utils** | `rangeUtils.spec.ts` | `clamp`, `snapToNearest`, `valueToPercent`, `percentToValue`, `roundToTwo`, `computeNewValue` |
| **Unit — hooks** | `useRange.spec.ts`, `useLabel.spec.ts` | Drag logic, label edit lifecycle, prop-change resets |
| **Unit — components** | `Range.spec.tsx`, `Bullet.spec.tsx`, `Label.spec.tsx`, `NavBar.spec.tsx` | Render, interaction, ARIA, cross-prevention |
| **Integration — pages** | `Exercise1.spec.tsx`, `Exercise2.spec.tsx` | Full fetch → render flow using MSW Node server |

### Shared testbed (`src/test-utils.tsx`)

All page-level tests use `renderWithProviders` instead of bare `render`. It wires up the full provider tree — `QueryClientProvider` (with `retry: false` for fast error surfacing) and `MemoryRouter`:

```tsx
import { renderWithProviders } from '@/test-utils'

renderWithProviders(<Exercise1 />)
```

A custom `QueryClient` can be passed when a test needs to inspect or pre-populate the cache:

```tsx
const queryClient = createTestQueryClient()
renderWithProviders(<Exercise1 />, { queryClient })
```

---

## Pre-commit hook

Every `git commit` automatically runs:

1. **lint-staged** — Prettier + ESLint on staged `src/**/*.{ts,tsx}` files only.
2. **Vitest** — all 146 tests must pass.

The commit is rejected if any step fails.

---

## CI/CD (GitHub Actions)

The `.github/workflows/ci.yml` pipeline runs on every push and pull request to `main`/`master`:

```
Prettier check → ESLint → Vitest → Vite build
```

Each step must pass before the next runs (fast-fail).
