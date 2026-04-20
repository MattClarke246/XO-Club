
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Favorites from './pages/Favorites';
import ProductPreviewModal from './components/ProductPreviewModal';
import CartSidebar from './components/CartSidebar';
import { Product, CartItem } from './types';

function readStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const AppContent: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => readStoredJson<CartItem[]>('xo-club-cart', []));
  const [favorites, setFavorites] = useState<Product[]>(() =>
    readStoredJson<Product[]>('xo-club-favorites', []),
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('xo-club-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('xo-club-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    const onMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.selectedSize === size 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const isFavorited = prev.some(item => item.id === product.id);
      if (isFavorited) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <AnimatedBackground />
      
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        favoritesCount={favorites.length}
      />
      
      <main>
        <Routes>
          <Route path="/" element={
            <Home 
              onPreview={setSelectedProduct} 
              onAddToCart={addToCart}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          } />
          <Route path="/shop" element={
            <Shop 
              onPreview={setSelectedProduct} 
              onAddToCart={addToCart}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          } />
          <Route path="/favorites" element={
            <Favorites 
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onPreview={setSelectedProduct}
              onAddToCart={addToCart}
            />
          } />
          <Route path="*" element={<Home onPreview={setSelectedProduct} onAddToCart={addToCart} />} />
        </Routes>
      </main>

      <Footer />

      <ProductPreviewModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart}
        isFavorited={selectedProduct ? favorites.some(f => f.id === selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      {/* Custom Global Cursor */}
      <div className="fixed top-0 left-0 w-8 h-8 border-2 border-white/20 rounded-full pointer-events-none z-[200] transition-transform duration-75 ease-out translate-x-[-50%] translate-y-[-50%] mix-blend-difference hidden lg:block" id="custom-cursor" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Toaster theme="dark" position="bottom-right" richColors toastOptions={{ style: { background: '#111', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <AppContent />
    </Router>
  );
};

export default App;
