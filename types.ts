
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  gallery: string[];
  description: string;
  sizes: string[];
  colors?: { name: string; hex: string }[];
  isNew?: boolean;
  isLimited?: boolean;
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  // Shopify-specific fields
  shopifyProductId?: string; // Shopify product ID (numeric, e.g., "123456")
  shopifyHandle?: string; // Product handle for URL (e.g., "retro-jordan-1-high")
  shopifyVariants?: Array<{
    id: string; // Shopify variant ID (numeric, e.g., "789012")
    title: string;
    price: number;
    available: boolean;
    size: string;
  }>;
}

export interface Drop {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  status: 'upcoming' | 'live' | 'archived';
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}
