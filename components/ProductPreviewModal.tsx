
import React, { useState } from 'react';
import { X, Heart, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import ShopifyBuyButton from './ShopifyBuyButton';

const SHOPIFY_STORE = import.meta.env.VITE_SHOPIFY_STORE || 'xo-club-test.myshopify.com';

interface ProductPreviewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);

  // Get variant ID for selected size
  const getVariantId = (size: string): string | null => {
    if (!product.shopifyVariants || product.shopifyVariants.length === 0) {
      return null;
    }
    
    const variant = product.shopifyVariants.find(v => 
      v.size === size || v.title === size || v.title.includes(size)
    );
    
    if (variant) {
      // Extract numeric ID from Shopify variant ID
      return variant.id.replace('gid://shopify/ProductVariant/', '');
    }
    
    // Fallback to first variant
    return product.shopifyVariants[0].id.replace('gid://shopify/ProductVariant/', '');
  };

  const handleBuyNow = () => {
    const variantId = getVariantId(selectedSize || product.sizes[0]);
    const storeName = SHOPIFY_STORE.replace('.myshopify.com', '');
    
    if (variantId) {
      window.location.href = `https://${storeName}.myshopify.com/cart/${variantId}:1`;
    } else if (product.shopifyHandle) {
      window.location.href = `https://${storeName}.myshopify.com/products/${product.shopifyHandle}`;
    } else {
      // Fallback to store homepage
      window.location.href = `https://${storeName}.myshopify.com`;
    }
  };

  const nextImg = () => setActiveImage((prev) => (prev + 1) % product.gallery.length);
  const prevImg = () => setActiveImage((prev) => (prev - 1 + product.gallery.length) % product.gallery.length);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-white/5 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors text-white"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden">
          {/* Gallery Section */}
          <div className="relative lg:w-3/5 h-[400px] lg:h-full bg-neutral-900 group">
            <img 
              src={product.gallery[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            
            {/* Nav Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={prevImg} className="p-3 bg-black/50 hover:bg-black rounded-full text-white">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextImg} className="p-3 bg-black/50 hover:bg-black rounded-full text-white">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 glass rounded-full">
              {product.gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-12 h-16 rounded-md overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-white' : 'border-transparent opacity-50'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-blue-500 font-black tracking-widest text-[10px] uppercase">{product.category}</span>
                {product.isLimited && (
                  <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-2 py-0.5 rounded uppercase">Low Stock</span>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-tight mb-2 uppercase">{product.name}</h2>
              <p className="text-2xl font-bold text-white/90 mb-6">${product.price}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {/* Selection */}
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Select Size</span>
                  <button className="text-[9px] font-black text-white/40 border-b border-white/10 hover:text-white transition-colors uppercase">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg text-xs font-black transition-all border ${
                        selectedSize === size 
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                          : 'bg-transparent text-white border-white/10 hover:border-white/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleBuyNow}
                  disabled={!selectedSize && product.sizes.length > 1}
                  className={`flex-1 py-5 rounded-full font-black text-xs tracking-[0.2em] transition-all duration-300 uppercase flex items-center justify-center gap-2 ${
                    !selectedSize && product.sizes.length > 1
                      ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                      : 'bg-white text-black hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <ShoppingBag size={18} />
                  {selectedSize || product.sizes.length === 1 ? 'BUY NOW' : 'SELECT SIZE'}
                </button>
                <button className="p-5 border border-white/10 rounded-full hover:bg-white/5 text-white transition-colors">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            <p className="mt-8 text-[10px] text-gray-600 font-bold tracking-widest text-center uppercase">
              Free Express Shipping on Orders Over $100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;
