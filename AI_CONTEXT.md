# AI_CONTEXT

Senast uppdaterad: 2026-03-20

## Syfte
Denna fil lagrar stabil projektkontext sa att nya Codex-sessioner snabbt kan leverera jamn kvalitet.
Om denna fil krockar med aktuell kod i repot ar koden sanningskallan.

## Produktsnapshot
- Produktnamn: SparkDeal
- Typ: Mobilanpassad e-handelsapp (demo/prototyp)
- Primart flode: Hem -> Prisval -> Kassa -> Stripe
- Startsidan visar en hero-video med tre fasta prisnivaer i stallet for sokning, produktgridar och katalogfloden
- Sprak och lokal: Svenska copy-texter, valuta i SEK (`sv-SE`)

## Tech Stack
- Next.js `16.1.6` (App Router)
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- ESLint `9`
- Paketmanager: npm (`package-lock.json`)

## Viktiga mappar
- `app/`: Rutter och sida-komposition
- `components/`: UI-komponenter per doman (`cart`, `checkout`, `home`, `product`, `search`, `layout`)
- `data/products.ts`: Statisk produktkatalog
- `store/cart.tsx`: Global varukorgsstate och localStorage-hydrering
- `lib/`: Hjalfunktioner (`products`, `format`, `analytics`, `shipping`, `promotions`, `websiteOffers`)
- `lib/bagMatch.ts`: logik for onskemalsanalys (steg + resultatcopy)
- `types/index.ts`: Centrala typer (`Product`, `CartItem`, `Shipping`)
- `docs/architecture.md`: Levande arkitekturdokumentation
- `AGENTS.md`: Repo-specifik sessionsrutin

## Arkitektur och dataflode
1. Startsidan renderar hero-komponenten `components/home/PriceHero.tsx` med video och tre fasta prisval.
2. Ett klick pa en prisniva skickar besokaren till `/checkout?offer=...`.
3. `components/checkout/CheckoutRedirectClient.tsx` startar Stripe Checkout for vald prisniva direkt mot `app/api/stripe/checkout/route.ts`.
4. `lib/websiteOffers.ts` ar sanningskallan for de tre prisnivaerna `2599`, `2899`, `3499`.
5. Varukorg, katalog, produktsidor och special-order-flode finns kvar i repot men ar inte del av det aktiva publika huvudflodet.
6. Analytik ar idag en placeholder (`console.info`) i `lib/analytics.ts`.

## Routekarta (huvud)
- `/` hem: hero/video med tre fasta prisnivaer
- `/checkout`: kassa med redirect till Stripe Checkout for vald prisniva eller ev. fallback-floden
- `/checkout/success`: bekräftelsesida efter lyckad Stripe-betalning
- `/checkout/cancel`: avbruten betalning
- `/orders`: hardkodad demo-lista
- `/account`: hardkodad demo-profil

## Domankontrakt som inte far brytas
- `Product.id` och `Product.slug` maste vara stabila och unika.
- `Product.images` maste vara giltiga filer under `public/products/...`.
- Priser representeras som numeriska kronor (inte oren stranglogik).
- Katalogens visade saljpriser normaliseras till tre prisnivaer: `2999`, `3499`, `3999`.
- Webbens publika hero-flode far endast exponera tre fasta prisval: `2599`, `2899`, `3499`.
- `formatMoney` ska fortsatt anvanda `sv-SE` + `SEK` for konsekvent visning.
- Frakt ar fast `129 kr` per produkt (`lib/shipping.ts`) och inkluderas i varukorg/checkout.
- Varukorgsrad identifieras av (`productId` + `selectedVariant`).
- `specialRequest` pa en varukorgsrad anvands endast for `Special order` och skickas vidare till Stripe som radbeskrivning/metadata.
- Rabattkoder valideras via `lib/promotions.ts` och appliceras i varukorgens totalsummering samt i Stripe-sessionens produkt-rader.
- Stripe-checkout kraver `STRIPE_SECRET_KEY` samt korrekt `NEXT_PUBLIC_APP_URL`.
- Ingen backend-orderpersistens an: `orders`/`account` ar fortsatt mock.

## Kodningsriktlinjer for framtida sessioner
- Hall affarslogik i `lib/` eller `store/`, inte i stora JSX-block.
- Behall TypeScript-typning strikt; undvik `any`.
- Behall svenska texter i UI om inte annat efterfragas.
- Favorisera server components dar klientlogik inte behovs.
- Nar analytics-event laggs till, uppdatera unionen `AnalyticsEvent` i `lib/analytics.ts`.

## Kanda begransningar / risker
- `orders` och `account` ar statiska mock-sidor.
- Katalog-, varukorgs- och produktfloden finns kvar i kodbasen men ar nedtonade i den publika upplevelsen och kan drifta om de inte underhalls.
- Checkout beror pa giltig Stripe-konfiguration i miljo/hosting.
- Kampanjer i `lib/promotions.ts` ar tidsstyrda och maste hallas uppdaterade for att fortsatt ge rabatt.
- Dokumentation kan drifta om `README.md`, `AI_CONTEXT.md` och `docs/architecture.md` inte uppdateras tillsammans.

## Lokal utveckling och verifiering
- Start: `npm run dev`
- Lint: `npm run lint`
- Produktionsbuild: `npm run build`
- Rekommenderad manuell smoke-test efter andring:
  - `/`, `/search`, `/p/<slug>`, `/cart`, `/checkout`

## Sessionprotokoll (viktigt)
I borjan av varje ny session:
1. Las i ordning: `AGENTS.md`, `AI_CONTEXT.md`, `README.md`, `docs/architecture.md`.
2. Sammanfatta kort uppgiften, constraints och plan.
3. Genomfor andringar.
4. Verifiera med relevanta kommandon.
