
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { getShopifyProducts } from '../lib/shopify';

interface ShopProps {
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

// Fallback products if Shopify is not configured
const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'RETRO JORDAN 1 HIGH', 
    price: 25, 
    category: 'FOOTWEAR', 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Iconic high-top silhouette with premium leather construction. Classic colorway featuring the legendary Air Jordan design. High-top design for maximum support and timeless style. The ultimate sneaker for collectors and streetwear enthusiasts.', 
    sizes: ['8', '9', '10', '11', '12'],
    isNew: true 
  },
  { 
    id: '2', 
    name: 'SUPREME BOX LOGO HOODIE', 
    price: 25, 
    category: 'FLEECE', 
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Premium heavyweight fleece hoodie featuring the iconic box logo. French terry cotton construction with brushed interior for ultimate comfort. Ribbed cuffs and hem, adjustable drawstring hood, and roomy front pocket. The streetwear essential that never goes out of style.', 
    sizes: ['M', 'L', 'XL', 'XXL'],
    isLimited: true 
  },
  { 
    id: '3', 
    name: 'TRAVIS SCOTT CACTUS JACK BEANIE', 
    price: 25, 
    category: 'ACCESSORIES', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Cactus Jack branded beanie with embroidered logo. Soft acrylic knit construction with stretch fit. One size fits most. Folded cuff design for versatile styling. The perfect accessory to complete any streetwear fit. Limited edition collaboration piece.', 
    sizes: ['ONE SIZE'],
    isNew: true
  },
  { 
    id: '4', 
    name: 'NORTH FACE RECON BACKPACK', 
    price: 25, 
    category: 'ACCESSORIES', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Durable 30L capacity backpack built for urban adventures. Water-resistant 600D recycled polyester construction. Padded laptop compartment, multiple organization pockets, and adjustable shoulder straps. Front bungee cord and top haul handle. The ultimate everyday carry for city life and beyond.', 
    sizes: ['ONE SIZE'],
    isLimited: true 
  },
];

const Shop: React.FC<ShopProps> = ({ onPreview, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from Shopify, fallback to mock products
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const shopifyProducts = await getShopifyProducts(50);
        if (shopifyProducts.length > 0) {
          setProducts(shopifyProducts);
          console.log('✅ Using Shopify products');
        } else {
          console.log('⚠️ No Shopify products found, using fallback products');
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.error('❌ Error fetching Shopify products:', error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-32">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16">
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 mb-8 text-white/70 hover:text-white transition-colors group"
          >
            <div className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all group-hover:-translate-x-1">
              <ChevronLeft size={20} />
            </div>
            <span className="text-xs font-black tracking-[0.3em] uppercase">BACK TO HOME</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-6xl md:text-8xl font-black text-tight mb-4 uppercase">DROP 042</h1>
              <p className="text-blue-500 font-black tracking-[0.3em] uppercase text-xs">WINTER ARCHIVE // NEW CURATION</p>
            </div>
            <p className="text-white/60 text-sm font-bold tracking-[0.2em] uppercase">
              {loading ? '...' : products.length} PIECES
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPreview={onPreview}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
