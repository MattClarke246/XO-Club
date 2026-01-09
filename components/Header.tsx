
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ onOpenCart, cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'JUST LANDED', href: '#/drops' },
    { name: 'MEN', href: '#/shop/men' },
    { name: 'WOMEN', href: '#/shop/women' },
    { name: 'ELITE ACCESSORIES', href: '#/shop/accessories' },
    { name: 'CULTURE', href: '#/culture' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-[90] transition-all duration-500 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-white hover:text-gray-400 transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.slice(0, 3).map((link) => (
            <a key={link.name} href={link.href} className="text-[10px] font-black tracking-[0.2em] text-white/70 hover:text-white transition-colors relative group uppercase">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Logo */}
        <a href="#/" className="text-2xl font-black tracking-tighter text-white hover:scale-105 transition-transform duration-300 flex items-center gap-1">
          XO CLUB<span className="text-blue-500 text-3xl leading-none">.</span>
        </a>

        {/* Utilities */}
        <div className="flex items-center space-x-5 lg:space-x-8">
          <nav className="hidden lg:flex items-center space-x-8">
             {navLinks.slice(3).map((link) => (
              <a key={link.name} href={link.href} className="text-[10px] font-black tracking-[0.2em] text-white/70 hover:text-white transition-colors relative group uppercase">
                {link.name}
              </a>
            ))}
          </nav>
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
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-[120] flex flex-col p-8 transition-all duration-500">
          <div className="flex justify-end">
            <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
              <X size={32} />
            </button>
          </div>
          <div className="flex flex-col space-y-10 mt-12">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-5xl font-black text-tight text-white hover:text-blue-500 transition-colors uppercase">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
