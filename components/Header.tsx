
import React, { useState, useEffect } from 'react';
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
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#/" className="text-2xl font-black tracking-tighter text-white hover:scale-105 transition-transform duration-300 flex items-center gap-1">
          XO CLUB<span className="text-blue-500 text-3xl leading-none">.</span>
        </a>

        {/* Utilities */}
        <div className="flex items-center space-x-4 md:space-x-6">
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
    </header>
  );
};

export default Header;
