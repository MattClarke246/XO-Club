#!/usr/bin/env tsx
/**
 * Product Sync Script
 * Syncs products from products/drops.ts to Shopify
 * 
 * Usage: npm run sync-shopify
 * 
 * Requirements:
 * - SHOPIFY_STORE environment variable
 * - SHOPIFY_ADMIN_TOKEN environment variable
 */

import * as dotenv from 'dotenv';
import { PRODUCT_DROPS } from '../products/drops';
import {
  createShopifyProduct,
  updateShopifyProduct,
  findProductByTitle,
  ProductDrop,
} from '../lib/shopify-admin';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || process.env.VITE_SHOPIFY_STORE;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

if (!SHOPIFY_STORE || !SHOPIFY_ADMIN_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   SHOPIFY_STORE:', SHOPIFY_STORE ? '✅' : '❌ Missing');
  console.error('   SHOPIFY_ADMIN_TOKEN:', SHOPIFY_ADMIN_TOKEN ? '✅' : '❌ Missing');
  console.error('\nPlease add these to your .env.local file:');
  console.error('   SHOPIFY_STORE=your-store.myshopify.com');
  console.error('   SHOPIFY_ADMIN_TOKEN=your_admin_token');
  process.exit(1);
}

async function syncProducts() {
  console.log('🚀 Starting product sync to Shopify...\n');
  console.log(`📦 Store: ${SHOPIFY_STORE}`);
  console.log(`📦 Products to sync: ${PRODUCT_DROPS.length}\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const product of PRODUCT_DROPS) {
    try {
      console.log(`\n📦 Processing: ${product.name}`);

      // Check if product already exists
      const existingProductId = await findProductByTitle(product.name);

      if (existingProductId) {
        console.log(`   ℹ️  Product already exists (ID: ${existingProductId})`);
        
        // Ask if you want to update
        // For now, we'll skip updates and only create new products
        console.log(`   ⏭️  Skipping update (product already exists)`);
        skippedCount++;
        continue;
      }

      // Create new product
      const productId = await createShopifyProduct(product);

      if (productId) {
        console.log(`   ✅ Successfully created product (ID: ${productId})`);
        successCount++;
      } else {
        console.log(`   ❌ Failed to create product`);
        errorCount++;
      }
    } catch (error: any) {
      console.error(`   ❌ Error syncing product: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Sync Summary:');
  console.log(`   ✅ Created: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('='.repeat(50));

  if (errorCount > 0) {
    console.log('\n⚠️  Some products failed to sync. Check the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All products synced successfully!');
    process.exit(0);
  }
}

// Run sync
syncProducts().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
