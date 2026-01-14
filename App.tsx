
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MessageSquare, Minimize2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import ProductPreviewModal from './components/ProductPreviewModal';
import CartSidebar from './components/CartSidebar';
import { Product, CartItem } from './types';
import { initializeAuth } from './lib/supabase';

// Define type for ElevenLabs custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 'agent-id'?: string }, HTMLElement>;
    }
  }
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('xo-club-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAi, setShowAi] = useState(true);
  const [isAiMinimized, setIsAiMinimized] = useState(false);

  useEffect(() => {
    localStorage.setItem('xo-club-cart', JSON.stringify(cart));
  }, [cart]);

  // Initialize Supabase authentication on app load
  useEffect(() => {
    initializeAuth().catch(error => {
      console.error('Failed to initialize authentication:', error);
    });
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

  // Logic: AI is only visible if master toggle is on AND cart is NOT open
  const shouldRenderAiWidget = showAi && !isCartOpen && !isAiMinimized;
  const shouldRenderAiTrigger = showAi && !isCartOpen && isAiMinimized;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <AnimatedBackground />
      
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
      />
      
      <main>
        <Routes>
          <Route path="/" element={<Home onPreview={setSelectedProduct} onAddToCart={addToCart} />} />
          <Route path="/shop" element={<Shop onPreview={setSelectedProduct} onAddToCart={addToCart} />} />
          <Route path="/checkout" element={
            <Checkout 
              cart={cart} 
              onUpdateQuantity={updateQuantity} 
              onRemove={removeFromCart} 
              onClearCart={clearCart}
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
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      {/* ElevenLabs Conversational AI Widget */}
      {shouldRenderAiWidget && (
        <>
          <elevenlabs-convai agent-id="agent_7101kedz95tbfakaqapjdsyk7jhr" />
          {/* Custom Minimize Button to override/augment widget UI */}
          <button 
            onClick={() => setIsAiMinimized(true)}
            className="fixed bottom-24 right-6 z-[100] bg-white/10 hover:bg-white/20 p-2 rounded-full border border-white/10 backdrop-blur-md transition-all md:bottom-28 lg:bottom-32"
            title="Minimize AI Assistant"
            aria-label="Minimize AI Assistant"
          >
            <Minimize2 size={14} className="text-white/60" />
          </button>
        </>
      )}

      {/* Minimized AI Bubble */}
      {shouldRenderAiTrigger && (
        <button 
          onClick={() => setIsAiMinimized(false)}
          className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-blue-500 text-white rounded-full shadow-[0_10px_40px_rgba(59,130,246,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={24} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping opacity-75" aria-hidden="true"></span>
        </button>
      )}
      
      {/* Custom Global Cursor */}
      <div className="fixed top-0 left-0 w-8 h-8 border-2 border-white/20 rounded-full pointer-events-none z-[200] transition-transform duration-75 ease-out translate-x-[-50%] translate-y-[-50%] mix-blend-difference hidden lg:block" id="custom-cursor" />

      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('mousemove', (e) => {
          const cursor = document.getElementById('custom-cursor');
          if (cursor) {
            cursor.style.transform = \`translate3d(\${e.clientX}px, \${e.clientY}px, 0)\`;
          }
        });
      `}} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
