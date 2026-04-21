# Project Structure

This project is a Vite + React storefront that uses Shopify-hosted checkout.

## Runtime App

- `App.tsx`: Top-level router, cart/favorites state, modals/sidebar wiring.
- `pages/`: Route-level pages (`Home`, `Shop`, `Favorites`).
- `components/`: Reusable UI pieces.
- `products/drops.ts`: Primary product content source for local catalog rendering.
- `types.ts`: Shared app and sync script types.

## Shopify Integration

- `components/CartSidebar.tsx`: Converts selected cart items into Shopify cart URL and redirects.
- `lib/shopify.ts`: Optional Shopify Storefront API client/helpers for fetching product data.
- `lib/shopify-admin.ts`: Admin API client intended for server/local script usage only.
- `scripts/sync-to-shopify.ts`: Local/CI script that syncs `products/drops.ts` content into Shopify.

## Tooling and Deployment

- `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`: Build/tooling config.
- `vercel.json`: SPA rewrite + security headers.
- `.env.example`: Expected environment variables for local dev and deployment.
- `docs/ops/`: Launch, compliance, reporting, and handoff operations pack.

## Non-App Assets

- `.bmad-core/`, `web-bundles/`: Agent/workflow resources, not part of the runtime storefront.
- `SHOPIFY_*` markdown files: Operational setup guides.
