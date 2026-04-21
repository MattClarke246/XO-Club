# Frontend-to-Shopify Hardening Checklist

## Environment Variables

- [ ] `VITE_SHOPIFY_STORE` is set in Vercel Production
- [ ] Optional `VITE_SHOPIFY_STOREFRONT_TOKEN` is public storefront token only (never Admin token)
- [ ] `.env.example` matches deployed env key names

## Runtime Behavior Validation

- [ ] Product with valid variants redirects to Shopify cart correctly
- [ ] Multi-item cart redirect URL includes all variant IDs
- [ ] Missing `VITE_SHOPIFY_STORE` shows safe error message (no broken redirect)
- [ ] Out-of-stock path behavior is defined and tested

## Security Controls

- [ ] `vercel.json` headers active in production (`nosniff`, `Referrer-Policy`, `Permissions-Policy`)
- [ ] CSP in `index.html` reviewed for least-privilege external hosts
- [ ] No secrets in client bundle (`VITE_*` keys contain only public values)

## Deployment Process

- [ ] Production branch set to `main`
- [ ] Auto-deploy permissions scoped only to this repository
- [ ] Rollback process tested on a previous deployment
