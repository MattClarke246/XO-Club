<!-- Powered by BMAD™ Core -->

# Shopify Prompt Integration Checklist

## Instructions for PM/Architect Agent

Before finalizing any prompt to be applied by the Dev Agent for Shopify integrations, run through this comprehensive set of **checks and balances**. The goal is a *smooth integration* without exposing secrets or breaking the storefront experience.

[[LLM: INITIALIZATION INSTRUCTIONS - SHOPIFY PRE-PROMPT VALIDATION
This checklist represents the checks and balances required before generating a UI/Implementation prompt.
Mark each item as [x] Done, [ ] Not Done, or [N/A] Not Applicable with comments.
If any required verification fails, DO NOT proceed to the prompted implementation. Send back to architecture/planning.
]]

## Checklist Items

1. **Architecture & Security:**
   - [ ] Are we strictly using the **Public Storefront API Token** (not the Admin API token) for frontend requests?
   - [ ] Is environment variable usage clearly defined (e.g., `VITE_SHOPIFY_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`)?
   - [ ] Will this prompt require dealing with Customer PII? If so, is data handling secure?

2. **Performance & Rate Limiting:**
   - [ ] Does the approach explicitly account for Shopify API rate limits (e.g., handling HTTP 429 Too Many Requests)?
   - [ ] Is data fetching optimized (e.g., retrieving only necessary product fields like `id`, `title`, `images`, `variants`)?
   - [ ] Are we caching product data appropriately to avoid redundant network calls?

3. **UI / UX Experience (Smoothness):**
   - [ ] Does the prompt explicitly request `loading` states for all cart mutations/additions?
   - [ ] Are error states mapped out (e.g., "Out of Stock", "API Network Error") so the frontend handles them gracefully?
   - [ ] Is the transition between the custom frontend and the Shopify Checkout URL clearly documented and smooth?

4. **Cart Management Integration:**
   - [ ] Does the design account for initializing a generic cart or retrieving an existing cart ID?
   - [ ] Is cart persistence addressed (e.g., saving the Cart ID to `localStorage` or `sessionStorage`)?
   - [ ] Does the prompt define state management usage (React Context / Zustand / Redux) for updating the cart globally across components?

5. **Existing Guidelines Alignment:**
   - [ ] Has the approach been cross-checked against existing README guidelines (e.g., `SHOPIFY_SETUP_GUIDE.md` or `SHOPIFY_BUY_BUTTON_SETUP.md`)?
   - [ ] Does the prompt adhere to the repository's styling and structure (e.g., vanilla CSS, existing component layout)?

## Final Decision Gate

[[LLM: FINAL PRE-PROMPT DECISION
Summarize your findings. Do we proceed to UI Prompt Generation, or redirect back to Architecture?
]]

- [ ] I confirm the prompt specifications are safe, optimized, and ready to be forwarded to the Developer agent.
