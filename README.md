# RACAN

A bright, editorial fashion-discovery and social-commerce application. React + TypeScript frontend, Express modular-monolith API, and PostgreSQL persistence. No MongoDB, microservices, or object storage.

## Run locally

Requires Node.js 22 or later.

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:3000**. The API runs on port 3001. On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.

The app starts without a separate database installation: development uses **PGlite, an embedded PostgreSQL engine**, persisted under `.data/racan`. This is not browser localStorage. Set `DATABASE_URL` to connect to a regular PostgreSQL instance instead. Embedded mode is blocked in production.

On first start, migrations and seed data create 12 brands, 36 products, 12 Reel records, advertisements, plans, and four accounts. The sign-in dialog offers **Shopper**, **Seller**, and **Admin** sessions only in development. No password is needed for these local exploration buttons. The demo endpoint is disabled when `NODE_ENV=production`.

Normal registration and email/password sign-in also work. Seed account emails are `user@racan.local`, `seller@racan.local`, `seller-2@racan.local`, and `admin@racan.local`. Set `SEED_PASSWORD` before the first start if you need deterministic seed-account credentials; otherwise a random password is printed once to the local server console. Do not deploy local seed accounts as customer accounts.

## What is implemented

- Landing page in the requested order: navigation, looping horizontal campaign carousel, circular Gen Z/Women entries, square brand cards, a second campaign, products, Reels, footer.
- Distinct Gen Z and Women discovery routes, categories, sorting, server-side pagination, product galleries and variants, brand profiles, creator profiles, and wishlist.
- Global debounced search across products, brands, categories, creators, and Reels, with recent searches.
- Vertical video playback, swipe/wheel/keyboard Reel navigation, mute/pause, likes, comments, saves, sharing, creator/brand follows, reports, and links from Reels to products.
- Registration, sign-in/out, hashed passwords, database sessions, account profile editing, development password-reset preview, and one-time reset tokens.
- Persistent variant-aware cart, quantities, save-for-later, shipping calculation, transactional checkout, idempotent order creation, atomic stock deduction, order history, and cancellation with inventory restoration.
- Seller studio with products, image uploads/previews/reordering, generated variant SKUs, inventory updates, brand editing, video uploads, shoppable Reel submission, posts, orders, basic analytics, and configurable plan display.
- Admin management of users, brand/product/Reel approval, categories, advertisements and schedules, order progression, plan prices/limits, reports, and platform shipping settings. Payments/reviews/posts are visible in admin tables.
- Uploaded JPEG, PNG, WebP, MP4, and WebM files stored in PostgreSQL `bytea` through `StorageService`; video byte-range responses support playback and seeking. No external storage account needed.
- Responsive layouts and mobile bottom navigation, lazy images, route splitting, local fonts/assets, modal focus containment, keyboard focus styling, and reduced-motion support.
- Public production product/brand HTML receives server-generated titles, descriptions, Open Graph tags and canonical links. Products include structured data; `/sitemap.xml` and `robots.txt` are provided.

## Important development boundaries

This is a runnable implementation and production-oriented foundation, **not a claim that the platform is ready to accept public payments or satisfy every launch requirement**.

- **Payments:** development adapter records test payments without charging money. It is explicitly labeled in checkout and refused in production. Stripe/Razorpay SDK calls, webhook signature verification, capture/refund reconciliation, and paid-subscription billing still need a real provider adapter and credentials.
- **Email:** development reset links appear in the UI. A transactional email delivery adapter is still required for production password resets. Production must not expose reset tokens.
- **Catalog:** seed products, ratings, prices, creator names, verification states, and analytics are illustrative. Photography does not establish a brand affiliation. The 12 seeded Reel records reuse one licensed sample fashion clip; replace them with seller-owned content before launch.
- **Fulfillment:** there is no courier integration, tracking-number service, real delivery promise, tax engine, or automated return/refund workflow. Admin can advance order status; sellers see their own order lines without access to other sellers’ lines.
- **Plans:** product and Reel upload limits are enforced; paid benefits, placement ranking, automated recurring billing, and richer analytics are not implemented. Further subscription entitlement expansion needs follow-up.
- **Social:** notifications are in-app and basic. No push/email delivery, recommendation model, content transcoding, automated moderation, or live comment transport. Creator follows and brand follows are separate. Full feed personalization is not implemented.
- **Administration:** the initial admin UI offers the actions described above; full review/post moderation, hard deletion, detailed audit trails, and bulk operations are follow-up work.
- **Operational hardening:** automated versioned migration tooling, production backup/restore drills, infrastructure monitoring, distributed rate limits, malware scanning, load testing, and approved privacy/seller/consumer policies remain deployment work.
- **Mobile:** this is a responsive web application, not a packaged native mobile app.

## Architecture

```text
src/
  components/       Navigation, carousel, cards, dialog, uploads
  lib/              API client, shared application state
  pages/            Discovery, product, Reels, shopping, account, studio, admin
shared/catalog.ts   Typed seed catalog
server/
  db/               SQL schema, pg/PGlite adapter, transaction boundary
  lib/              HTTP errors, server-rendered SEO metadata
  modules/
    auth.ts         Accounts, sessions, reset tokens, roles
    catalog.ts      Discovery, public profiles, search
    social.ts       Wishlist, follows, Reel interactions, notifications
    commerce.ts     Cart, orders, inventory-safe checkout
    payments.ts     PaymentProvider boundary and development adapter
    storage.ts      StorageService / PostgreSQLStorageService
    management.ts   Seller and admin ownership-checked operations
  seed.ts
  index.ts          HTTP transport, security middleware, static serving
tests/              Integration tests against an isolated PostgreSQL data dir
scripts/            Asset acquisition and browser journey checks
```

Modules use parameterized SQL. `db.query` and `transaction` form the repository boundary; embedded connection access is serialized. Checkout locks the user row, checks all product availability, atomically decrements each variant’s stock, writes order lines and payment state, and clears the cart in one transaction. `(user_id, idempotency_key)` is unique. Cancellation locks the order and restores stock only once.

The current payment implementation is entirely local and transaction-safe. A real remote payment integration must use a pending-order/reservation workflow and verified, idempotent webhooks; do not simply perform a remote charge inside the existing database transaction.

## Configuration

Copy `.env.example` to `.env` and fill only the options you need. Secrets are server-side environment variables and must never use a `VITE_` prefix.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Standard PostgreSQL connection; required in production |
| `DATA_DIR` | Embedded development database path |
| `PORT` | API port; defaults to 3001 |
| `APP_ORIGIN` | Exact public HTTPS origin for production write requests and SEO |
| `NODE_ENV` | Set `production` for production guards and secure cookies |
| `PAYMENT_PROVIDER` | Currently only `development` is implemented |
| `SEED_PASSWORD` | Initial sample account password; required for first production seed |

For a local external PostgreSQL instance, set `POSTGRES_PASSWORD` and run `docker compose up -d`. Set `DATABASE_URL=postgresql://racan:YOUR_PASSWORD@127.0.0.1:5432/racan`. The Docker port binds to loopback.

```sh
npm run build
npm start
```

The server then serves the compiled app at port 3001. Development auth shortcuts and test payments remain available unless `NODE_ENV=production`. Use HTTPS behind a reverse proxy for production secure cookies, configure the public origin, and replace the sample catalog/accounts before launch. The server binds to loopback by default.

## Verification

```sh
npm run build
npm test
node scripts/visual-check.mjs
node scripts/journey-check.mjs
```

API tests boot their own server on port 3102 and an isolated `.data/test-*` database. They verify relational seed data, role authorization, privilege-escalation prevention, logout, idempotent social writes, input validation, checkout atomicity/idempotency, competing buyers for the last item, stock restoration, seller ownership, file-signature checks, moderation visibility, and origin protection.

Browser scripts require the development server and use the installed Windows Chrome executable. Adjust `executablePath` for another operating system. Screenshots are saved under ignored `artifacts/`. Journey checks exercise development checkout/cancellation, seller image upload and product submission, admin approval, catalog visibility, video playback, comments, and mobile Reels. The seller QA product is soft-deleted after successful checks; test orders/comments remain on the local demo account.

## Media credits

Photography: [Unsplash](https://unsplash.com/license); exact photo identifiers are in `scripts/download-assets.py`. The replacement bag source is `photo-1584917865442-de89df76afd3`. Fonts: DM Sans and Cormorant Garamond from Google Fonts, downloaded locally (SIL Open Font License).

Sample Reel: [Mixkit — vertical fashion model, clip 52281](https://mixkit.co/free-stock-video/vertical-video-of-young-beautiful-model-with-a-white-dress-52281/), offered under the [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree). Keep source attribution in project documentation when replacing or extending assets.

## Verification completed in this workspace

- TypeScript check and production Vite build: passed.
- 12 isolated API integration tests: passed.
- Desktop and mobile screenshots: no broken images, no horizontal overflow, no browser runtime errors.
- Browser journeys: cart/checkout/cancellation, seller upload/submission, admin approval/public discovery, real video playback, likes/comments, and mobile Reels passed.

These checks used embedded PostgreSQL in development. An external PostgreSQL deployment and real payment/email providers have not been validated in this environment.
