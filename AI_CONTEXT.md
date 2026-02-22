# AI_CONTEXT

Senast uppdaterad: 2026-02-22

## Syfte
Denna fil lagrar stabil projektkontext sa att nya Codex-sessioner snabbt kan leverera jamn kvalitet.
Om denna fil krockar med aktuell kod i repot ar koden sanningskallan.

## Produktsnapshot
- Produktnamn: SparkDeal
- Typ: Mobilanpassad e-handelsapp (demo/prototyp)
- Primart flode: Hem -> Produktsida -> Varukorg -> Kassa -> Bestallningar/Konto
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
- `components/`: UI-komponenter per doman (`cart`, `checkout`, `product`, `search`, `layout`)
- `data/products.ts`: Statisk produktkatalog
- `store/cart.tsx`: Global varukorgsstate och localStorage-hydrering
- `lib/`: Hjalfunktioner (`products`, `format`, `analytics`, `shipping`)
- `types/index.ts`: Centrala typer (`Product`, `CartItem`, `Shipping`)
- `docs/architecture.md`: Levande arkitekturdokumentation
- `AGENTS.md`: Repo-specifik sessionsrutin

## Arkitektur och dataflode
1. Produktdata laddas statiskt fran `data/products.ts`.
2. Produktlistor/urval byggs via `lib/products.ts` (kategorier, flash deals, trending, paginering, relaterat, etc).
3. UI renderar i App Router-sidor under `app/`.
4. Varukorgen hanteras klientside i `store/cart.tsx` och persisteras i localStorage med nyckeln `dealflow_cart`.
5. Checkout initieras direkt fran varukorgens CTA i `components/cart/CartPage.tsx` och via fallback i `components/checkout/CheckoutRedirectClient.tsx`, som skickar varukorgens rader till `app/api/stripe/checkout/route.ts`.
6. Analytik ar idag en placeholder (`console.info`) i `lib/analytics.ts`.

## Routekarta (huvud)
- `/` hem: hero, kategorier, urvalssektioner, paginerad alla-produkter
- `/p/[slug]`: produktsida med metadata, JSON-LD, galleri, kop-panel, relaterade produkter
- `/search`: sok + filter + sortering
- `/cart`: varukorg
- `/checkout`: kassa med redirect till Stripe Checkout
- `/checkout/success`: bekräftelsesida efter lyckad Stripe-betalning
- `/checkout/cancel`: avbruten betalning
- `/orders`: hardkodad demo-lista
- `/account`: hardkodad demo-profil

## Domankontrakt som inte far brytas
- `Product.id` och `Product.slug` maste vara stabila och unika.
- `Product.images` maste vara giltiga filer under `public/products/...`.
- Priser representeras som numeriska kronor (inte oren stranglogik).
- `formatMoney` ska fortsatt anvanda `sv-SE` + `SEK` for konsekvent visning.
- Frakt ar fast `129 kr` per produkt (`lib/shipping.ts`) och inkluderas i varukorg/checkout.
- Varukorgsrad identifieras av (`productId` + `selectedVariant`).
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
- `getForYou()` ar slumpbaserad och inte deterministisk mellan renderingar.
- Checkout beror pa giltig Stripe-konfiguration i miljo/hosting.
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
