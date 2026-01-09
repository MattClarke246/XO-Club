
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
