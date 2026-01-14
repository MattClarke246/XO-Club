
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ onOpenCart, cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[90] transition-all duration-500 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 items-center">
          {/* Left: The Shop Button */}
          <div className="flex justify-start">
            <Link 
              to="/shop" 
              className="text-[10px] font-black tracking-[0.2em] text-white/70 hover:text-white transition-colors uppercase"
            >
              THE SHOP
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link 
              to="/" 
              className="text-2xl font-black tracking-tighter text-white hover:scale-105 transition-transform duration-300 flex items-center gap-1"
            >
              XO CLUB<span className="text-blue-500 text-3xl leading-none">.</span>
            </Link>
          </div>

          {/* Right: Utilities */}
          <div className="flex items-center justify-end space-x-4 md:space-x-6">
            <button className="text-white hover:text-blue-500 transition-all hover:scale-110">
              <Search size={18} strokeWidth={2.5} />
            </button>
            <button className="text-white hover:text-blue-500 transition-all hover:scale-110 hidden md:block">
              <Heart size={18} strokeWidth={2.5} />
            </button>
            <button className="text-white hover:text-blue-500 transition-all hover:scale-110" onClick={onOpenCart}>
              <div className="relative">
                <ShoppingBag size={18} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
