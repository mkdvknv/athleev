<<<<<<< HEAD
# Athleev Storefront

Custom React + Vite + Tailwind storefront backed by Shopify Storefront API through
`shopify-buy` v3. Product cards, product detail choices, and cart UI remain custom;
the bundled catalogue renders immediately and Shopify replaces it only when a
valid Storefront configuration loads successfully.

## Shopify Client

Create `.env` beside `package.json`:

```env
VITE_SHOPIFY_DOMAIN=athleev-nutrition.myshopify.com
VITE_SHOPIFY_API_VERSION=2026-04
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_public_headless_storefront_token
```

`2026-04` is Shopify's latest stable Storefront API version as of May 25, 2026.
Only place a public Storefront token in Vite environment variables; browser builds
expose every `VITE_` value.

The `.env` file must be at `athleev/.env`, in the same directory as
`package.json` and `vite.config.js`. This repository includes `.env.example`,
but Vite will not read `.env.example` as application configuration. Without
`.env`, local products and local cart functionality remain available.

## Fix Locked Channel

`Online Store channel is locked` is returned by Shopify before React receives
products. It is not removable with a frontend code change alone.

1. In Shopify Admin, install or open the **Headless** sales channel.
2. Create a custom storefront under Headless for this React site.
3. Configure public Storefront permissions for product listings and cart/checkout
   access, then copy the public Storefront token into `.env`.
4. Publish each product to the Headless storefront sales channel.
5. If the Shopify store itself is frozen, paused, trial-locked, or development
   checkout is disabled, activate an eligible plan or use Shopify's allowed test
   flow. A locked/inactive shop cannot serve a working production storefront.
6. Restart Vite after changing `.env`.

Stop the current Vite process and run `npm run dev` again after creating or
changing `.env`; environment values are loaded when the dev server starts.

When enabling Shopify, verify that Vite can see the configuration without
printing the token:

```bash
npm run check:shopify-env
```

Do not use an Admin API token, private Storefront token, or a token issued for a
locked sales channel in client-side React code.

## Implementation

- [src/shopify.js](src/shopify.js) configures `shopify-buy`, maps Shopify product
  models into the existing UI model, reports configuration/channel errors, and
  persists a Shopify cart ID in `localStorage`.
- [src/App.jsx](src/App.jsx) starts with local products, upgrades to live Shopify
  products after a successful optional fetch, and forwards Shopify cart actions
  only for Shopify-backed products.
- Product list/detail views display Shopify images, titles, prices, variants, and
  availability using the existing premium layout.

Shopify deprecated JS Buy SDK in January 2025 and released v3 as its final major
version using Cart API operations. This project uses v3 because it is explicitly
required here; a later production migration should use Shopify's Storefront API
Client.

## Development

```bash
npm install
npm run dev
```

Verification:

```bash
npm run lint
npm run build
```

Optional Shopify configuration check:

```bash
npm run check:shopify-env
```
=======
# athleev
ATHLEEV is a premium sports nutrition and fitness lifestyle e-commerce platform offering high-quality supplements, performance products, and athletic apparel. Built with React and Vite, the platform delivers a modern shopping experience focused on strength, recovery, endurance, and overall wellness.
>>>>>>> 203e3a1ec0fac9f7eaaed80af77d3e8430118d22
