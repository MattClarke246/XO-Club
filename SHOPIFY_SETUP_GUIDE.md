# Shopify Integration Setup Guide

Complete step-by-step instructions to sync your Shopify test store with the website.

## Prerequisites

- Shopify account (free 14-day trial available)
- Node.js installed
- Access to your project directory

---

## Part 1: Create Shopify Test Store

### Step 1: Sign Up for Shopify

1. Go to [shopify.com](https://www.shopify.com)
2. Click **Start free trial**
3. Enter your email address
4. Create a password
5. Enter your store name (e.g., `xo-club-test`)
6. Answer a few questions about your business
7. Click **Create your store**

### Step 2: Complete Store Setup

1. Enter your store details:
   - Country/region
   - Contact information
   - Store address
2. Click **Complete setup**

### Step 3: Note Your Store URL

Your store URL will be: `your-store-name.myshopify.com`
- Example: `xo-club-test.myshopify.com`
- **Save this URL** - you'll need it later

---

## Part 2: Enable Shopify APIs

### Step 4: Enable Storefront API

1. In Shopify Admin, go to **Settings** (bottom left)
2. Click **Apps and sales channels**
3. Click **Develop apps** (if visible) or **Manage private apps**
4. Click **Allow custom app development**
5. Click **Allow** to confirm
6. Click **Create an app**
7. Name it: `XO Club Website Integration`
8. Click **Create app**

### Step 5: Configure Storefront API Access

1. In your new app, click **Configure Admin API scopes**
2. Scroll down and click **Configure Storefront API scopes**
3. Enable these permissions:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_write_customers`
   - ✅ `unauthenticated_read_customers`
4. Click **Save**
5. Click **Install app**

### Step 6: Get Storefront API Token

1. After installing, go to **API credentials** tab
2. Under **Storefront API access token**, click **Reveal token once**
3. **Copy the token** (starts with `shpat_` or `shpss_`)
4. **Save this token securely** - you won't see it again!

---

## Part 3: Configure Admin API (for Product Sync)

### Step 7: Configure Admin API Scopes

1. In the same app, click **Configure Admin API scopes**
2. Enable these permissions:
   - ✅ `read_products`
   - ✅ `write_products`
   - ✅ `read_product_listings`
   - ✅ `read_inventory`
   - ✅ `write_inventory`
3. Click **Save**

### Step 8: Get Admin API Token

1. Go to **API credentials** tab
2. Under **Admin API access token**, click **Reveal token once**
3. **Copy the token** (starts with `shpat_`)
4. **Save this token securely**

---

## Part 4: Install Dependencies

### Step 9: Install Required Packages

Open your terminal in the project directory and run:

```bash
cd /Users/montgomery6/Downloads/xo-club---street-luxury-2
npm install
```

This will install:
- `@shopify/storefront-api-client`
- `@shopify/admin-api-client`
- `tsx` (for running sync scripts)

---

## Part 5: Configure Environment Variables

### Step 10: Create/Update .env.local

1. Open or create `.env.local` in your project root
2. Add the following variables:

```env
# Shopify Configuration
VITE_SHOPIFY_STORE=your-store-name.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token_here
SHOPIFY_STORE=your-store-name.myshopify.com
SHOPIFY_ADMIN_TOKEN=your_admin_token_here
SHOPIFY_ADMIN_API_VERSION=2024-01
```

**Important:**
- Replace `your-store-name` with your actual store name
- Replace `your_storefront_token_here` with the Storefront API token from Step 6
- Replace `your_admin_token_here` with the Admin API token from Step 8
- **Do NOT commit `.env.local` to Git** (it should be in `.gitignore`)

### Example .env.local:

```env
# Shopify Configuration
VITE_SHOPIFY_STORE=xo-club-test.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=shpss_1234567890abcdef
SHOPIFY_STORE=xo-club-test.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_1234567890abcdef
SHOPIFY_ADMIN_API_VERSION=2024-01
```

---

## Part 6: Sync Products to Shopify

### Step 11: Review Product Definitions

1. Open `products/drops.ts`
2. Review the products defined there
3. These are the products that will be synced to Shopify
4. You can edit this file to add/remove/modify products

### Step 12: Run Product Sync

Run the sync script:

```bash
npm run sync-shopify
```

**Expected Output:**
```
🚀 Starting product sync to Shopify...
📦 Store: xo-club-test.myshopify.com
📦 Products to sync: 4

📦 Processing: RETRO JORDAN 1 HIGH
   ✅ Successfully created product (ID: 1234567890)

📦 Processing: SUPREME BOX LOGO HOODIE
   ✅ Successfully created product (ID: 1234567891)

...

📊 Sync Summary:
   ✅ Created: 4
   ⏭️  Skipped: 0
   ❌ Errors: 0
```

### Step 13: Verify Products in Shopify

1. Go to Shopify Admin → **Products**
2. You should see all your products listed
3. Click on a product to verify:
   - Product name ✅
   - Description ✅
   - Images ✅
   - Variants (sizes) ✅
   - Pricing ✅

---

## Part 7: Test Website Integration

### Step 14: Start Development Server

```bash
npm run dev
```

### Step 15: Test Product Display

1. Open `http://localhost:3000`
2. Products should load from Shopify
3. Check browser console for:
   - `✅ Shopify Storefront API client initialized`
   - `✅ Fetched X products from Shopify`

### Step 16: Test Checkout Flow

1. Add items to cart
2. Go to checkout
3. Fill in shipping information
4. Proceed to payment
5. Click "Proceed to Checkout"
6. You should be redirected to Shopify checkout
7. Complete a test order

---

## Part 8: Adding New Products (Drops)

### Step 17: Add Product to Code

1. Open `products/drops.ts`
2. Add a new product object:

```typescript
{
  id: '5',
  name: 'NEW PRODUCT NAME',
  price: 50,
  description: 'Product description here...',
  images: [
    'https://image-url-1.com',
    'https://image-url-2.com',
  ],
  variants: [
    { size: 'S' },
    { size: 'M' },
    { size: 'L' },
  ],
  category: 'CATEGORY_NAME',
  isNew: true,
  isLimited: false,
  tags: ['Tag1', 'Tag2'],
},
```

### Step 18: Sync New Product

Run the sync script again:

```bash
npm run sync-shopify
```

The script will:
- Check if product exists
- Create new product if it doesn't exist
- Skip if product already exists (to prevent duplicates)

---

## Troubleshooting

### Error: "Shopify client not initialized"

**Solution:**
- Check that `.env.local` exists
- Verify environment variables are set correctly
- Restart development server after adding env vars

### Error: "Missing required environment variables"

**Solution:**
- Verify all Shopify variables in `.env.local`
- Check that token values are correct
- Make sure no quotes around token values

### Error: "401 Unauthorized"

**Solution:**
- Verify API tokens are correct
- Check that apps are installed in Shopify
- Ensure API scopes are enabled

### Error: "404 Not Found"

**Solution:**
- Verify store URL is correct (must end with `.myshopify.com`)
- Check that store name matches exactly

### Products Not Appearing on Website

**Solution:**
1. Check browser console for errors
2. Verify products exist in Shopify Admin
3. Ensure products are published (status: Active)
4. Check that Storefront API is enabled

### Sync Script Errors

**Solution:**
1. Verify Admin API token is correct
2. Check that Admin API scopes are enabled
3. Ensure products/drops.ts file is valid TypeScript
4. Check network connection

---

## Important Notes

### For Production Handoff

When selling the website to a buyer:

1. **Keep test store separate** - Don't give them your test store
2. **Provide setup instructions** - Give them this guide
3. **They create their own store** - They'll follow steps 1-8
4. **Update environment variables** - They replace test store with theirs
5. **No code changes needed** - Everything works the same way

### Environment Variables for Buyer

Provide them with a `.env.example` file:

```env
# Shopify Configuration
VITE_SHOPIFY_STORE=their-store-name.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=their_storefront_token
SHOPIFY_STORE=their-store-name.myshopify.com
SHOPIFY_ADMIN_TOKEN=their_admin_token
SHOPIFY_ADMIN_API_VERSION=2024-01
```

---

## Verification Checklist

Before going live, verify:

- [ ] Shopify store created and configured
- [ ] Storefront API enabled with correct scopes
- [ ] Admin API enabled with correct scopes
- [ ] All environment variables set in `.env.local`
- [ ] Products synced successfully (`npm run sync-shopify`)
- [ ] Products visible in Shopify Admin
- [ ] Products loading on website from Shopify
- [ ] Checkout redirecting to Shopify
- [ ] Test order completed successfully

---

## Next Steps

Once everything is working:

1. **Customize products** - Edit `products/drops.ts` to match your inventory
2. **Add more products** - Follow steps 17-18
3. **Style checkout** - Customize Shopify checkout appearance (Shopify Plus required)
4. **Monitor orders** - Use Shopify Dashboard to manage all orders

---

## Support

If you encounter issues:

1. Check Shopify Admin for API errors
2. Review browser console for frontend errors
3. Check network tab for failed API calls
4. Verify all tokens and URLs are correct

---

**Last Updated**: January 2025
**Version**: 1.0
