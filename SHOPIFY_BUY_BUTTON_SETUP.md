# Shopify Buy Button Integration - Setup Guide

Complete instructions for connecting your Shopify store products to the website frontend.

---

## Overview

Your website now uses **Shopify Buy Button** integration:
- Products display on your website (frontend)
- "Buy Now" buttons redirect to Shopify checkout
- All orders are processed through Shopify
- Orders appear in Shopify Dashboard
- No custom checkout page needed

---

## Part 1: Create Products in Shopify

### Step 1: Add Products to Shopify

1. Go to **Shopify Admin**: `admin.shopify.com/store/xo-club-test`
2. Navigate to **Products** → **Add product**
3. For each product, add:

**Product Information:**
- **Title**: Product name** (e.g., "RETRO JORDAN 1 HIGH")
- **Description**: Product description
- **Images**: Upload product images
- **Price**: Product price
- **Status**: Set to **Active** (published)

**Variants (Sizes):**
- Click **Variants** section
- Add variants for each size:
  - **Option name**: Size
  - **Option values**: 8, 9, 10, 11, 12 (for shoes) or M, L, XL, XXL (for clothing)
- Each variant can have its own price (or use same price for all)

4. Click **Save** for each product

---

## Part 2: Get Product IDs from Shopify

### Step 2: Find Product IDs

For each product, you need:
1. **Product ID** (numeric)
2. **Product Handle** (URL-friendly name)
3. **Variant IDs** (one for each size)

#### Method 1: From Product URL

1. In Shopify Admin → **Products** → Click on a product
2. Look at the URL: `admin.shopify.com/store/xo-club-test/products/PRODUCT_ID`
3. The number after `/products/` is your **Product ID**
4. The product handle is in the URL or under **Search engine listing preview**

#### Method 2: From Product Settings

1. Click on a product
2. Scroll to bottom → **Search engine listing preview**
3. The handle is shown there (e.g., `retro-jordan-1-high`)

#### Method 3: Get Variant IDs

1. In product page → **Variants** section
2. Click on a variant
3. Look at URL: `admin.shopify.com/store/xo-club-test/products/PRODUCT_ID/variants/VARIANT_ID`
4. The number after `/variants/` is your **Variant ID**

---

## Part 3: Connect Products to Website Code

### Step 3: Update Product Data in Code

1. Open `pages/Home.tsx` and `pages/Shop.tsx`
2. Find the `MOCK_PRODUCTS` array
3. For each product, add Shopify IDs:

```typescript
{
  id: '1',
  name: 'RETRO JORDAN 1 HIGH',
  price: 25,
  category: 'FOOTWEAR',
  // ... existing fields ...
  
  // ADD THESE SHOPIFY FIELDS:
  shopifyProductId: '123456', // Your Shopify Product ID (numeric)
  shopifyHandle: 'retro-jordan-1-high', // Product handle from Shopify
  shopifyVariants: [
    {
      id: '789012', // Variant ID for size 8
      title: '8',
      price: 25,
      available: true,
      size: '8'
    },
    {
      id: '789013', // Variant ID for size 9
      title: '9',
      price: 25,
      available: true,
      size: '9'
    },
    // ... add variant for each size
  ]
}
```

### Step 4: Example - Complete Product with Shopify IDs

```typescript
{
  id: '1',
  name: 'RETRO JORDAN 1 HIGH',
  price: 25,
  category: 'FOOTWEAR',
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  gallery: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    // ... more images
  ],
  description: 'Iconic high-top silhouette...',
  sizes: ['8', '9', '10', '11', '12'],
  isNew: true,
  
  // Shopify Integration Fields
  shopifyProductId: '123456789', // Replace with actual Product ID
  shopifyHandle: 'retro-jordan-1-high', // Replace with actual handle
  shopifyVariants: [
    { id: '987654321', title: '8', price: 25, available: true, size: '8' },
    { id: '987654322', title: '9', price: 25, available: true, size: '9' },
    { id: '987654323', title: '10', price: 25, available: true, size: '10' },
    { id: '987654324', title: '11', price: 25, available: true, size: '11' },
    { id: '987654325', title: '12', price: 25, available: true, size: '12' },
  ]
}
```

---

## Part 4: Environment Variables

### Step 5: Add Shopify Store Name

1. Open `.env.local` (create if it doesn't exist)
2. Add:

```env
VITE_SHOPIFY_STORE=xo-club-test.myshopify.com
```

**Note**: Replace `xo-club-test` with your actual Shopify store name.

---

## Part 5: Testing

### Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`

3. Test Buy Button:
   - Click on a product
   - Select a size
   - Click "BUY NOW"
   - Should redirect to Shopify checkout

4. Test Cart Checkout:
   - Add items to cart (if cart functionality is still enabled)
   - Click "PROCEED TO CHECKOUT"
   - Should redirect to Shopify checkout with all items

---

## How It Works

### Product Display
- Products are defined in your code (`MOCK_PRODUCTS`)
- Images, descriptions, prices come from your code
- Shopify IDs are stored in product data

### Buy Button Flow
1. User clicks "BUY NOW" on product
2. Website finds Shopify variant ID for selected size
3. Redirects to: `https://xo-club-test.myshopify.com/cart/VARIANT_ID:1`
4. Shopify checkout opens with that product
5. User completes order on Shopify
6. Order appears in Shopify Dashboard

### Cart Checkout Flow
1. User adds items to cart
2. User clicks "PROCEED TO CHECKOUT"
3. Website builds cart URL with all variant IDs
4. Redirects to: `https://xo-club-test.myshopify.com/cart/VARIANT_ID1:QTY1,VARIANT_ID2:QTY2`
5. Shopify checkout opens with all items
6. User completes order on Shopify

---

## Quick Reference: Finding IDs

### Product ID
- URL: `admin.shopify.com/store/xo-club-test/products/123456`
- Product ID: `123456`

### Product Handle
- Product page → Scroll to bottom → **Search engine listing preview**
- Handle: `retro-jordan-1-high`

### Variant ID
- Product page → Variants section → Click variant
- URL: `admin.shopify.com/store/xo-club-test/products/123456/variants/789012`
- Variant ID: `789012`

---

## Example: Complete Setup for One Product

### In Shopify:
1. Create product: "RETRO JORDAN 1 HIGH"
2. Add variants: Size 8, 9, 10, 11, 12
3. Note Product ID: `123456789`
4. Note Handle: `retro-jordan-1-high`
5. Note Variant IDs:
   - Size 8: `987654321`
   - Size 9: `987654322`
   - Size 10: `987654323`
   - Size 11: `987654324`
   - Size 12: `987654325`

### In Code (`pages/Home.tsx` or `pages/Shop.tsx`):

```typescript
{
  id: '1',
  name: 'RETRO JORDAN 1 HIGH',
  price: 25,
  category: 'FOOTWEAR',
  image: 'https://your-image-url.com',
  gallery: ['https://image1.com', 'https://image2.com'],
  description: 'Your product description...',
  sizes: ['8', '9', '10', '11', '12'],
  isNew: true,
  
  // Shopify Connection
  shopifyProductId: '123456789',
  shopifyHandle: 'retro-jordan-1-high',
  shopifyVariants: [
    { id: '987654321', title: '8', price: 25, available: true, size: '8' },
    { id: '987654322', title: '9', price: 25, available: true, size: '9' },
    { id: '987654323', title: '10', price: 25, available: true, size: '10' },
    { id: '987654324', title: '11', price: 25, available: true, size: '11' },
    { id: '987654325', title: '12', price: 25, available: true, size: '12' },
  ]
}
```

---

## Troubleshooting

### Buy Button doesn't redirect
- **Check**: Product has `shopifyVariants` with valid IDs
- **Check**: `VITE_SHOPIFY_STORE` is set correctly in `.env.local`
- **Check**: Variant IDs are numeric (not full Shopify GID format)

### Wrong product opens in Shopify
- **Check**: Variant IDs match the correct sizes
- **Check**: Product handle is correct

### Cart checkout doesn't work
- **Check**: All cart items have `shopifyVariants` with IDs
- **Check**: Variant IDs are correct for selected sizes

---

## Important Notes

1. **Product IDs are numeric**: Use just the number (e.g., `123456`), not the full GID format
2. **Variant IDs are numeric**: Use just the number (e.g., `789012`), not the full GID format
3. **Store name**: Use store name without `.myshopify.com` in redirect URLs
4. **Product handle**: Use the handle from Shopify (URL-friendly name)

---

## For Production Handoff

When selling the website:

1. **Provide this guide** to the buyer
2. **They create products** in their Shopify store
3. **They update product IDs** in `Home.tsx` and `Shop.tsx`
4. **They update store name** in `.env.local`
5. **No code changes needed** - just update product data

---

**Last Updated**: January 2025
**Version**: 1.0
