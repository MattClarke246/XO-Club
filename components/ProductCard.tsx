
import React, { useState } from 'react';
import { Heart, Maximize2, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPreview: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPreview, onAddToCart }) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && product.sizes.length > 0) {
      onAddToCart(product, product.sizes[0]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div className="group relative cursor-pointer" onClick={() => onPreview(product)}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#0a0a0a] transition-all duration-700 shadow-xl group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] group-hover:-translate-y-2 border border-white/5">
        <img 
          src={product.image} 
          alt={`${product.name} - ${product.category}`}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-40"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-white text-black text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase">Just Landed</span>
          )}
          {product.isLimited && (
            <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase">Only {Math.floor(Math.random() * 40) + 10} Left</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            className={`p-3 rounded-full transition-all shadow-lg active:scale-90 ${justAdded ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-blue-500 hover:text-white'}`}
            onClick={handleQuickAdd}
            title="Instantly add to bag"
          >
            {justAdded ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
          </button>
          <button 
            className="p-3 bg-black/50 glass text-white rounded-full hover:bg-white hover:text-black transition-colors"
            onClick={(e) => { e.stopPropagation(); onPreview(product); }}
          >
            <Maximize2 size={16} strokeWidth={2.5} />
          </button>
          <button className="p-3 bg-black/50 glass text-white rounded-full hover:bg-white hover:text-black transition-colors">
            <Heart size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Bottom Overlay Actions */}
        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button className="w-full bg-white text-black py-4 text-[10px] font-black tracking-[0.2em] rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 uppercase shadow-2xl">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-5 flex justify-between items-start">
        <div>
          <h3 className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase mb-1">{product.category}</h3>
          <h2 className="text-sm font-black tracking-tight text-white group-hover:text-blue-400 transition-colors uppercase">{product.name}</h2>
        </div>
        <span className="text-sm font-black text-white/90">${product.price}</span>
      </div>
    </div>
  );
};

export default ProductCard;
