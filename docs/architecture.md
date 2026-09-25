# Architecture

Last updated: 2026-03-20

## System Overview
bags is a Next.js App Router storefront centered on a full-screen hero video and a live product search.
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
- `/`: landing page with `LV1.mp4` and live catalog search
- `/p/[slug]`: legacy product details + purchase panel
- `/search`: redirects to the search-first home page
- `/cart`: legacy cart detail + summary
- `/checkout`: redirect route that starts Stripe-hosted checkout for a selected website offer or fallback cart flow
- `/checkout/success`: payment success page
- `/checkout/cancel`: payment canceled page
- `/orders`: mock order history
- `/account`: mock account page

## Rendering Model
- Most pages are server components.
- Interactive components opt into client mode (`"use client"`), including:
  - live search and add-to-cart controls on the home hero
  - checkout redirect bootstrapping
  - cart interactions in legacy flows
  - analytics tracking hooks

## Data Flow
1. `components/layout/FloatingCart.tsx` renders cart status as a global lower-right action; there is no global header or visible company identity.
2. `components/home/HeroSearch.tsx` renders `LV1.mp4` with the search field as the only central hero control.
3. `lib/products.ts` ranks matches and expands `LV` to the `Louis Vuitton` category.
4. Search results link to product details and can add catalog products to the persisted cart.
5. Product buy-now and cart checkout routes start `components/checkout/CheckoutRedirectClient.tsx`.
6. `app/api/stripe/checkout/route.ts` creates the Stripe Checkout Session from validated catalog products.

## State and Persistence
- Cart line items and active promotion code are persisted in browser localStorage under `dealflow_cart`.
- Special-order request text is persisted on the relevant cart line in the same localStorage payload.
- No server persistence for cart/orders/account.
- Product checkout uses the cart state; the older direct-offer path remains supported internally.

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
- `LV` and `Louis Vuitton` are equivalent search intents and must return the full current Louis Vuitton category.
- Promotion codes are applied in the cart and validated again by the Stripe route.
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
- Search, catalog, product, cart, and checkout contracts can drift if they are not verified together.
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
