# Order Management Dashboard

React 18 + TypeScript prototype for a TMS order management module.

## Setup

```bash
npm install
npm run dev
```

Production check:

```bash
npm run lint
npm run format:check
npm run build
```

## Architecture

The project follows Feature-Sliced Design:

- `shared` contains base UI, config, small libs, and mock transport helpers.
- `entities/order` owns order contracts, Zod schema, formatters, status machine, and mock API data logic.
- `entities/carrier` exposes carrier API/types as a small supporting entity.
- `features` contain user actions: create, edit, delete, change status, and manage local drafts.
- `widgets` compose reusable page blocks: app layout, orders table, order form.
- `pages` wire routing, queries, mutations, and widget composition.

## Implemented

- Strict TypeScript order model: `Order`, `OrderStatus`, `Carrier`, `Stop`, `Address`, `StatusChange`.
- Mock orders API with `localStorage` persistence, 300-800ms delay, and 5% random errors.
- Orders table with shadcn-style table components, skeletons, empty/error states, retry, pagination, and sorting.
- Status machine with allowed transitions:
  `pending -> in_transit | cancelled`, `in_transit -> delivered | cancelled`.
- Zustand drafts store persisted to `localStorage`, max 5 drafts.
- Order form with React Hook Form + Zod and client/order/stops sections.

## Tradeoffs

- The carrier combobox is implemented with a native `datalist` to keep the first iteration small.
- Draft creation opens a dialog workspace with persisted draft tabs; the direct `/orders/new` route is kept as a fallback entry point.
- Toasts and confirmation dialogs are not added yet; API errors are handled in the table with retry.

## What I'd Improve With More Time

- Replace the native carrier `datalist` with a full shadcn/Radix searchable combobox.
- Add toast notifications and confirmation dialogs for status changes and deletion.
- Expand the draft workspace into real multi-draft tabs with explicit close, clear all, and duplicate flows.
- Add focused tests for the status machine, form validation, and mock API persistence.
- Split route-level pages with lazy imports if bundle size becomes a production concern.
