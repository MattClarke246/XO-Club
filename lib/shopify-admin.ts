// Shopify Admin API Client for product synchronization
// This is used server-side or via Edge Functions to sync products to Shopify
// For client-side usage, we use fetch directly to Admin API

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || '';
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || '';
const SHOPIFY_ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-01';

// Note: Admin API should be called from server-side (Edge Function or API route)
// For sync script, we use Node.js process.env

export interface ProductDrop {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  variants: Array<{
    size: string;
    price?: number;
  }>;
  category: string;
  isNew?: boolean;
  isLimited?: boolean;
  tags?: string[];
}

// Create product in Shopify via Admin API
export async function createShopifyProduct(product: ProductDrop): Promise<string | null> {
  if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_STORE) {
    console.error('❌ Shopify Admin credentials not configured');
    return null;
  }

  const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/products.json`;

  // Build variants
  const variants = product.variants.map((variant) => ({
    option1: variant.size,
    price: (variant.price || product.price).toString(),
    inventory_quantity: 100, // Default stock
    inventory_management: 'shopify',
  }));

  // Build images
  const images = product.images.map((url, index) => ({
    src: url,
    position: index + 1,
  }));

  // Build tags
  const tags = [
    product.category,
    ...(product.isNew ? ['NEW'] : []),
    ...(product.isLimited ? ['LIMITED'] : []),
    ...(product.tags || []),
  ].join(',');

  // Build metafields
  const metafields = [
    {
      namespace: 'custom',
      key: 'category',
      value: product.category,
      type: 'single_line_text_field',
    },
    {
      namespace: 'custom',
      key: 'is_new',
      value: (product.isNew || false).toString(),
      type: 'boolean',
    },
    {
      namespace: 'custom',
      key: 'is_limited',
      value: (product.isLimited || false).toString(),
      type: 'boolean',
    },
  ];

  const payload = {
    product: {
      title: product.name,
      body_html: product.description,
      vendor: 'XO Club',
      product_type: product.category,
      tags: tags,
      variants: variants,
      images: images,
      metafields_global_title_tag: product.name,
      metafields_global_description_tag: product.description,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error creating Shopify product:', errorData);
      throw new Error(errorData.errors || 'Failed to create product');
    }

    const data = await response.json();
    const productId = data.product?.id;
    
    // Create metafields after product is created
    if (productId) {
      await createProductMetafields(productId.toString(), metafields);
    }

    console.log(`✅ Created Shopify product: ${product.name} (ID: ${productId})`);
    return productId?.toString() || null;
  } catch (error: any) {
    console.error('❌ Error creating Shopify product:', error);
    throw error;
  }
}

// Update existing product in Shopify
export async function updateShopifyProduct(shopifyProductId: string, product: ProductDrop): Promise<boolean> {
  if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_STORE) {
    console.error('❌ Shopify Admin credentials not configured');
    return false;
  }

  const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/products/${shopifyProductId}.json`;

  const variants = product.variants.map((variant) => ({
    option1: variant.size,
    price: (variant.price || product.price).toString(),
  }));

  const images = product.images.map((url, index) => ({
    src: url,
    position: index + 1,
  }));

  const tags = [
    product.category,
    ...(product.isNew ? ['NEW'] : []),
    ...(product.isLimited ? ['LIMITED'] : []),
    ...(product.tags || []),
  ].join(',');

  const payload = {
    product: {
      id: shopifyProductId,
      title: product.name,
      body_html: product.description,
      product_type: product.category,
      tags: tags,
      variants: variants,
      images: images,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error updating Shopify product:', errorData);
      return false;
    }

    console.log(`✅ Updated Shopify product: ${product.name}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error updating Shopify product:', error);
    return false;
  }
}

// Check if product exists in Shopify by title
export async function findProductByTitle(title: string): Promise<string | null> {
  if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_STORE) {
    return null;
  }

  const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/products.json?title=${encodeURIComponent(title)}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const product = data.products?.[0];
    return product?.id?.toString() || null;
  } catch (error: any) {
    console.error('❌ Error finding product:', error);
    return null;
  }
}

// Create metafields for a product
async function createProductMetafields(productId: string, metafields: any[]): Promise<void> {
  if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_STORE) {
    return;
  }

  for (const metafield of metafields) {
    const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/products/${productId}/metafields.json`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({ metafield }),
      });
    } catch (error: any) {
      console.warn(`⚠️ Failed to create metafield ${metafield.key}:`, error);
    }
  }
}
