# Shopify Integration - Quick Start Guide

This is a condensed version of the full setup guide. For detailed instructions, see `SHOPIFY_SETUP_GUIDE.md`.

---

## ⚡ Quick Setup (5 Steps)

### 1. Create Shopify Test Store
- Go to [shopify.com](https://www.shopify.com)
- Sign up for free trial
- Note your store URL: `your-store-name.myshopify.com`

### 2. Enable APIs in Shopify
1. Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Create an app**
3. Name it: `XO Club Website Integration`
4. **Storefront API**: Enable scopes (read products, write checkouts)
5. **Admin API**: Enable scopes (read/write products)
6. **Install app** and get tokens:
   - Storefront API token (copy this)
   - Admin API token (copy this)

### 3. Add Environment Variables
Create/update `.env.local`:

```env
VITE_SHOPIFY_STORE=your-store-name.myshopify.com
SHOPIFY_STORE=your-store-name.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
SHOPIFY_ADMIN_TOKEN=your_admin_token
SHOPIFY_ADMIN_API_VERSION=2024-01
```

### 4. Sync Products to Shopify
```bash
npm run sync-shopify
```

### 5. Test Website
```bash
npm run dev
```

Open `http://localhost:3000` - products should load from Shopify!

---

## ✅ Verification

- [ ] Products visible in Shopify Admin
- [ ] Products loading on website
- [ ] Checkout redirects to Shopify
- [ ] Test order completes successfully

---

## 🆘 Troubleshooting

**Products not showing?**
- Check browser console for errors
- Verify `.env.local` has correct values
- Ensure products are published in Shopify

**Sync script fails?**
- Verify `SHOPIFY_ADMIN_TOKEN` is correct
- Check that Admin API scopes are enabled
- Ensure store URL is correct

---

For full detailed instructions, see `SHOPIFY_SETUP_GUIDE.md`
