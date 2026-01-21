import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { Product } from '../types';

// Shopify Storefront API Client
const SHOPIFY_STORE = import.meta.env.VITE_SHOPIFY_STORE || '';
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

let storefrontClient: ReturnType<typeof createStorefrontApiClient> | null = null;

if (SHOPIFY_STORE && SHOPIFY_STOREFRONT_TOKEN) {
  storefrontClient = createStorefrontApiClient({
    storeDomain: SHOPIFY_STORE,
    apiVersion: '2024-01',
    publicAccessToken: SHOPIFY_STOREFRONT_TOKEN,
  });
  console.log('✅ Shopify Storefront API client initialized');
} else {
  console.warn('⚠️ Shopify credentials not found - using fallback products');
}

// GraphQL query to fetch products
const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          tags
          metafields(identifiers: [
            {namespace: "custom", key: "category"},
            {namespace: "custom", key: "is_new"},
            {namespace: "custom", key: "is_limited"}
          ]) {
            edges {
              node {
                namespace
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

// Transform Shopify product to our Product type
function transformShopifyProduct(shopifyProduct: any): Product {
  const metafields = shopifyProduct.metafields?.edges?.reduce((acc: any, edge: any) => {
    acc[edge.node.key] = edge.node.value;
    return acc;
  }, {}) || {};

  const images = shopifyProduct.images?.edges?.map((edge: any) => edge.node.url) || [];
  const featuredImage = shopifyProduct.featuredImage?.url || images[0] || '';
  
  // Extract sizes from variants
  const sizes = shopifyProduct.variants?.edges?.map((edge: any) => {
    const sizeOption = edge.node.selectedOptions?.find((opt: any) => 
      opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'title'
    );
    return sizeOption?.value || 'ONE SIZE';
  }) || [];

  // Get unique sizes
  const uniqueSizes = Array.from(new Set(sizes));

  const price = parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || '0');
  const variantIds = shopifyProduct.variants?.edges?.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    price: parseFloat(edge.node.price?.amount || '0'),
    available: edge.node.availableForSale,
    size: edge.node.selectedOptions?.find((opt: any) => opt.name.toLowerCase() === 'size')?.value || 'ONE SIZE'
  })) || [];

  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    price: price,
    category: metafields.category || shopifyProduct.tags?.[0]?.toUpperCase() || 'GENERAL',
    image: featuredImage,
    gallery: images.length > 0 ? images : [featuredImage],
    description: shopifyProduct.description || '',
    sizes: uniqueSizes.length > 0 ? uniqueSizes : ['ONE SIZE'],
    isNew: metafields.is_new === 'true',
    isLimited: metafields.is_limited === 'true',
    // Store Shopify-specific data
    shopifyHandle: shopifyProduct.handle,
    shopifyVariants: variantIds,
  } as Product & { shopifyHandle?: string; shopifyVariants?: any[] };
}

// Fetch products from Shopify
export async function getShopifyProducts(limit: number = 20): Promise<Product[]> {
  if (!storefrontClient) {
    console.warn('⚠️ Shopify client not initialized - returning empty array');
    return [];
  }

  try {
    const response = await storefrontClient.request(PRODUCTS_QUERY, {
      variables: { first: limit },
    });

    if (response.data?.products?.edges) {
      const products = response.data.products.edges.map((edge: any) => 
        transformShopifyProduct(edge.node)
      );
      console.log(`✅ Fetched ${products.length} products from Shopify`);
      return products;
    }

    return [];
  } catch (error: any) {
    console.error('❌ Error fetching products from Shopify:', error);
    console.error('Error details:', error.message);
    return [];
  }
}

// Fetch single product by handle
export async function getShopifyProductByHandle(handle: string): Promise<Product | null> {
  if (!storefrontClient) {
    return null;
  }

  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        tags
        metafields(identifiers: [
          {namespace: "custom", key: "category"},
          {namespace: "custom", key: "is_new"},
          {namespace: "custom", key: "is_limited"}
        ]) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }
  `;

  try {
    const response = await storefrontClient.request(query, {
      variables: { handle },
    });

    if (response.data?.product) {
      return transformShopifyProduct(response.data.product);
    }

    return null;
  } catch (error: any) {
    console.error('❌ Error fetching product from Shopify:', error);
    return null;
  }
}

// Get variant ID for a product and size
export function getVariantId(product: Product & { shopifyVariants?: any[] }, size: string): string | null {
  if (!product.shopifyVariants) {
    return null;
  }

  const variant = product.shopifyVariants.find((v: any) => 
    v.size === size || v.title === size || v.title.includes(size)
  );

  return variant?.id || product.shopifyVariants[0]?.id || null;
}

// Create Shopify checkout URL
export function createShopifyCheckoutUrl(productId: string, variantId: string, quantity: number = 1): string {
  const store = SHOPIFY_STORE.replace('.myshopify.com', '');
  return `https://${store}.myshopify.com/cart/${variantId}:${quantity}`;
}

// Create checkout URL for multiple items
export function createShopifyCheckoutUrlForCart(items: Array<{ variantId: string; quantity: number }>): string {
  const store = SHOPIFY_STORE.replace('.myshopify.com', '');
  const cartItems = items.map(item => `${item.variantId}:${item.quantity}`).join(',');
  return `https://${store}.myshopify.com/cart/${cartItems}`;
}

export { storefrontClient };
