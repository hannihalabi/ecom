# SparkDeal

SparkDeal is a mobile-first e-commerce storefront prototype built with Next.js App Router.
It focuses on fast browsing, clear discounts, and a simple checkout flow.

## Tech
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Requirements
- Node.js 20+
- npm

## Local Development
Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts
- `npm run dev`: start local dev server
- `npm run lint`: run ESLint
- `npm run build`: production build check
- `npm run start`: run production server (after build)

## Project Structure
- `app/`: routes and page shells
- `components/`: reusable UI components
- `data/products.ts`: static catalog data
- `lib/`: formatting, catalog derivations, analytics helpers
- `store/cart.tsx`: client cart state and persistence
- `types/index.ts`: domain types
- `docs/architecture.md`: architecture and data flow documentation
- `AI_CONTEXT.md`: stable AI/session context

## Current Product Behavior
- Home page exposes multiple catalog slices (flash, trending, under price, for-you, paginated list).
- Product page includes:
  - gallery
  - purchase panel
  - shipping and pricing info
  - JSON-LD metadata
- Search page provides text search, filters, and sorting.
- Cart is persisted in localStorage (`dealflow_cart`).
- "Till kassan" i varukorgen startar Stripe-checkout direkt (utan mellanliggande formulär) och returnerar till:
  - `/checkout/success` after completed payment
  - `/checkout/cancel` if payment is cancelled

## Stripe Setup
Set these environment variables before using checkout:

```bash
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Session Workflow (for AI + human)
Start each coding session by reading:
1. `AGENTS.md`
2. `AI_CONTEXT.md`
3. `README.md`
4. `docs/architecture.md`

Then:
1. Summarize architecture, constraints, and risks.
2. Propose a 3-6 step plan.
3. Implement.
4. Verify with lint + build.

## Known Limitations
- `orders` and `account` pages are mock data.
- Analytics events are currently console-only.
- Recommendation slice (`getForYou`) is random and non-deterministic.
