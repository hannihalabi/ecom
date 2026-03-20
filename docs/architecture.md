# Architecture

Last updated: 2026-03-20

## System Overview
SparkDeal is a Next.js App Router storefront prototype centered on a single hero video and three fixed checkout price points.
There is no backend order service yet.

## Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9

## Directory Layout
- `app/`: route-level pages, metadata, loading states
- `components/`: UI by domain (`product`, `cart`, `checkout`, `search`, `layout`, `shared`)
- `data/products.ts`: static product source of truth
- `lib/shipping.ts`: shared shipping policy (`129 SEK` per product) and totals helper
- `lib/products.ts`: derived read-model functions (categories, search, related, paging)
- `lib/specialOrder.ts`: synthetic special-order product and identifiers
- `lib/websiteOffers.ts`: fixed website offer definitions for direct checkout
- `lib/promotions.ts`: discount-code validation and discount helpers
- `store/cart.tsx`: cart state container + localStorage persistence
- `types/index.ts`: domain types

## Route Map
- `/`: landing page with hero/video and three fixed price selections
- `/p/[slug]`: legacy product details + purchase panel
- `/search`: legacy route redirected back to `/`
- `/cart`: legacy cart detail + summary
- `/checkout`: redirect route that starts Stripe-hosted checkout for a selected website offer or fallback cart flow
- `/checkout/success`: payment success page
- `/checkout/cancel`: payment canceled page
- `/orders`: mock order history
- `/account`: mock account page

## Rendering Model
- Most pages are server components.
- Interactive components opt into client mode (`"use client"`), including:
  - price selection on the home hero
  - checkout redirect bootstrapping
  - cart interactions in legacy flows
  - analytics tracking hooks

## Data Flow
1. `components/home/PriceHero.tsx` renders the public-facing hero video, three fixed price options, and a promo-code segment.
2. The selected option is encoded into `/checkout?offer=<id>` and carries an activated promo code when present.
3. `lib/websiteOffers.ts` defines the three website-visible offers: `2599`, `2899`, `3499`.
4. `components/checkout/CheckoutRedirectClient.tsx` starts checkout directly from the selected offer.
5. `app/api/stripe/checkout/route.ts` creates the Stripe Checkout Session for either a direct website offer or the legacy cart-based flow.
6. Catalog, cart, product pages, search helpers, and special-order logic remain in the repository as legacy/fallback functionality.

## State and Persistence
- Cart line items and active promotion code are persisted in browser localStorage under `dealflow_cart`.
- Special-order request text is persisted on the relevant cart line in the same localStorage payload.
- No server persistence for cart/orders/account.
- The direct website-offer checkout path does not require cart state.

## External Integrations
- Stripe Checkout is called from `app/api/stripe/checkout/route.ts`.
- Required environment variables:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_APP_URL`

## Domain Contracts
- Product identifiers and slugs are stable keys.
- Image paths in catalog must resolve under `public/products/`.
- Price fields are numeric and formatted via `lib/format.ts`.
- Display pricing is constrained to three normalized tiers across the catalog.
- The public website surface only exposes three fixed direct-checkout prices: `2599`, `2899`, `3499`.
- The public hero flow currently supports the campaign code `MAND25` for 25% off.
- Discount percentage is derived in `data/products.ts` when missing.
- Shipping is fixed at `129 SEK` per product and is added in cart totals and Stripe checkout.
- Promotion code behavior is governed by `lib/promotions.ts` and must stay consistent between cart totals and Stripe checkout line items.

## SEO and Metadata
- Global metadata is declared in `app/layout.tsx`.
- Product page generates dynamic metadata and product JSON-LD.
- Static params for product routes are generated from catalog slugs.

## Known Risks
- `README.md` can drift unless kept in sync with architecture docs.
- `getForYou()` is random, which can make output non-deterministic.
- Orders/account are static mocks and may be mistaken for real backend-backed flows.
- Analytics currently logs to console only.
- Legacy catalog/search/cart code can drift because the public UX no longer exercises it as the primary path.
- Stripe checkout depends on environment configuration and available outbound network.
- Promotion windows in `lib/promotions.ts` are time-bound and can expire.
- Catalog file names contain accent/Unicode combinations that can be fragile across tooling.

## Verification Baseline
After behavior or architectural changes run:
- `npm run lint`
- `npm run build`

Also do a manual smoke check on:
- `/`
- `/search`
- `/p/<slug>`
- `/cart`
- `/checkout`
