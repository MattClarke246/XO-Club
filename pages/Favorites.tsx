import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface FavoritesProps {
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ 
  favorites, 
  onToggleFavorite, 
  onPreview, 
  onAddToCart 
}) => {
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
              <h1 className="text-6xl md:text-8xl font-black text-tight mb-4 uppercase">FAVORITES</h1>
              <p className="text-blue-500 font-black tracking-[0.3em] uppercase text-xs">YOUR WISHLIST</p>
            </div>
            <p className="text-white/60 text-sm font-bold tracking-[0.2em] uppercase">
              {favorites.length} {favorites.length === 1 ? 'ITEM' : 'ITEMS'}
            </p>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 mx-auto">
              <Heart size={40} className="text-gray-700" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">NO FAVORITES YET</h2>
            <p className="text-gray-500 mb-10 font-bold tracking-[0.2em] uppercase text-xs leading-relaxed max-w-md mx-auto">
              Start adding items to your wishlist by clicking the heart icon on any product.
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-white text-black px-12 py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-xl"
            >
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPreview={onPreview}
                onAddToCart={onAddToCart}
                isFavorited={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
