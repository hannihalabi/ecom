# bags

bags is a mobile-first e-commerce storefront built with Next.js App Router.
The landing page uses a full-screen video and a focused catalog search that leads into product, cart, and Stripe Checkout flows.

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
- The `bags` header remains available across the storefront and links to the cart.
- Home uses `public/mp4/LV1.mp4` as a full-screen hero background.
- The only hero control is the product search.
- Search results update while typing and support the `LV`/`Louis Vuitton` alias.
- Results link to product pages and can be added directly to the cart.
- Cart and buy-now flows continue to Stripe Checkout.
- Cart is still persisted in localStorage (`dealflow_cart`) for legacy/fallback flows.
- Stripe checkout returns to:
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
