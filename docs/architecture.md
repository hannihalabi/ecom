# Architecture

Last updated: 2026-03-13

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
- `lib/products.ts`: derived read-model functions (categories, search, related, paging)
- `lib/specialOrder.ts`: synthetic special-order product and identifiers
- `lib/promotions.ts`: discount-code validation and discount helpers
- `store/cart.tsx`: cart state container + localStorage persistence
- `types/index.ts`: domain types

## Route Map
- `/`: landing page with hero/video and interactive model search
- `/p/[slug]`: product details + purchase panel
- `/search`: direct-entry version of the same hero search experience as `/`
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
  - hero search state + special-order creation
  - countdown timer
  - analytics tracking hooks

## Data Flow
1. `data/products.ts` exports `products`.
2. `data/products.ts` normalizes catalog pricing into three customer-facing tiers: `2999`, `3499`, `3999`.
3. `lib/products.ts` derives category lists, related products, and text search matches.
4. `components/home/BagRequestMatcher.tsx` searches the static catalog client-side and either links to a matching product or creates a `Special order`.
5. `store/cart.tsx` manages cart actions, promotion-code state, special-order request text, and computed totals.
6. `components/cart/CartPage.tsx` starts checkout directly from the "Till kassan" CTA.
7. `components/checkout/CheckoutRedirectClient.tsx` provides fallback redirect behavior for `/checkout`.
8. Stripe Checkout Session is created server-side, optional promotion code is validated/applied, and special-order request text is passed through line-item metadata/description before redirecting to Stripe-hosted payment.

## State and Persistence
- Cart line items and active promotion code are persisted in browser localStorage under `dealflow_cart`.
- Special-order request text is persisted on the relevant cart line in the same localStorage payload.
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
- Display pricing is constrained to three normalized tiers across the catalog.
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
- Hero search is a client-side catalog lookup and not connected to live inventory.
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
