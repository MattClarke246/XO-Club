# SOP: Deployment, Access, and Client Handoff

## Deployment (Vercel + GitHub)

1. Ensure Git repo access is scoped to this project only.
2. Confirm production branch (`main`) in Vercel project settings.
3. Set env vars in Vercel production:
   - `VITE_SHOPIFY_STORE`
   - optional `VITE_SHOPIFY_STOREFRONT_TOKEN` (public storefront token only)
4. Push to `main` and verify deployment health.
5. Run checkout redirect smoke test in production.

## Security Controls

- [ ] 2FA enabled on GitHub and Vercel
- [ ] Least-privilege collaborator roles
- [ ] Remove stale integrations and users
- [ ] Rotate credentials after incidents as needed

## Client Handoff Package

- [ ] Architecture one-pager
- [ ] Shopify setup checklist completion evidence
- [ ] Raffle compliance checklist status
- [ ] Profit workbook template and SOP
- [ ] Access matrix (owner, collaborator, finance)
- [ ] Incident response mini-playbook

## Incident Response Mini-Playbook

1. Revoke suspicious tokens/integrations.
2. Rotate impacted credentials.
3. Lock deployment access to trusted users only.
4. Verify production environment variables and domains.
5. Redeploy from known-good commit.
6. Log incident timeline and remediation actions.
