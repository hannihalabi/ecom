# Architecture

Last updated: 2026-02-22

## System Overview
SparkDeal is a Next.js App Router storefront prototype with static catalog data and client-side cart state.
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
- `lib/products.ts`: derived read-model functions (filters, categories, related, paging)
- `store/cart.tsx`: cart state container + localStorage persistence
- `types/index.ts`: domain types

## Route Map
- `/`: landing page with category chips and product sections
- `/p/[slug]`: product details + purchase panel + related products
- `/search`: client-side search and filtering UI
- `/cart`: cart detail + summary
- `/checkout`: fallback route that immediately starts Stripe-hosted checkout
- `/checkout/success`: payment success page
- `/checkout/cancel`: payment canceled page
- `/orders`: mock order history
- `/account`: mock account page

## Rendering Model
- Most pages are server components.
- Interactive components opt into client mode (`"use client"`), including:
  - cart interactions
  - search filter state
  - countdown timer
  - analytics tracking hooks

## Data Flow
1. `data/products.ts` exports `products`.
2. `lib/products.ts` derives category lists and sorted/filter slices.
3. Route pages pass selected product sets into presentation components.
4. `store/cart.tsx` manages cart actions and computed totals.
5. `components/cart/CartPage.tsx` starts checkout directly from the "Till kassan" CTA.
6. `components/checkout/CheckoutRedirectClient.tsx` provides fallback redirect behavior for `/checkout`.
7. Stripe Checkout Session is created server-side and client is redirected to Stripe-hosted payment.

## State and Persistence
- Cart is persisted in browser localStorage under `dealflow_cart`.
- No server persistence for cart/orders/account.

## External Integrations
- Stripe Checkout is called from `app/api/stripe/checkout/route.ts`.
- Required environment variables:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_APP_URL`

## Domain Contracts
- Product identifiers and slugs are stable keys.
- Image paths in catalog must resolve under `public/products/`.
- Price fields are numeric and formatted via `lib/format.ts`.
- Discount percentage is derived in `data/products.ts` when missing.
- Shipping is fixed at `129 SEK` per product and is added in cart totals and Stripe checkout.

## SEO and Metadata
- Global metadata is declared in `app/layout.tsx`.
- Product page generates dynamic metadata and product JSON-LD.
- Static params for product routes are generated from catalog slugs.

## Known Risks
- `README.md` can drift unless kept in sync with architecture docs.
- `getForYou()` is random, which can make output non-deterministic.
- Orders/account are static mocks and may be mistaken for real backend-backed flows.
- Analytics currently logs to console only.
- Stripe checkout depends on environment configuration and available outbound network.
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
