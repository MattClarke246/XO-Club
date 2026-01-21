
import React from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

const SHOPIFY_STORE = 'jiir8p-qz.myshopify.com';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string, size: string) => void;
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemove, 
  onUpdateQuantity
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleShopifyCheckout = () => {
    // Build cart items with Shopify variant IDs
    const checkoutItems = cart
      .map((item) => {
        // Try to get variant ID from product
        const variant = (item as any).shopifyVariants?.find((v: any) => 
          v.size === item.selectedSize || v.title === item.selectedSize
        );
        
        if (variant) {
          const variantId = variant.id.replace('gid://shopify/ProductVariant/', '');
          return `${variantId}:${item.quantity}`;
        }
        
        return null;
      })
      .filter((item): item is string => item !== null);

    if (checkoutItems.length === 0) {
      alert('No valid Shopify products in cart. Please add products with Shopify variant IDs.');
      return;
    }

    const storeName = SHOPIFY_STORE.replace('.myshopify.com', '');
    const cartUrl = checkoutItems.join(',');
    window.location.href = `https://${storeName}.myshopify.com/cart/${cartUrl}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#080808] border-l border-white/10 z-[101] transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8 md:p-10">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-blue-500" />
              <h2 className="text-xl font-black tracking-tight uppercase">YOUR BAG ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                  <ShoppingBag size={40} className="text-gray-700" />
                </div>
                <h3 className="text-lg font-black uppercase mb-4 tracking-tighter">Your bag is empty</h3>
                <p className="text-gray-500 text-xs font-bold mb-10 max-w-[200px] leading-relaxed uppercase tracking-widest">
                  Looks like you haven't added any elite pieces yet.
                </p>
                <button 
                  onClick={onClose} 
                  className="group flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase hover:text-white transition-all"
                >
                  Start Shopping <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-5 group animate-in slide-in-from-right-4 duration-300">
                  <div className="w-24 h-32 bg-neutral-900 rounded-xl overflow-hidden flex-shrink-0 shadow-2xl">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[11px] font-black tracking-tight uppercase group-hover:text-blue-500 transition-colors">{item.name}</h3>
                        <button 
                          onClick={() => onRemove(item.id, item.selectedSize)}
                          className="p-1 text-gray-700 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[9px] text-gray-500 font-black tracking-widest uppercase">SIZE: {item.selectedSize}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xs font-black transition-colors"
                        >-</button>
                        <span className="w-8 text-center text-[10px] font-black">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xs font-black transition-colors"
                        >+</button>
                      </div>
                      <span className="text-sm font-black text-white/90">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-8 border-t border-white/10 mt-8 space-y-6">
            {cart.length > 0 && (
              <>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-500 tracking-[0.2em] uppercase">Estimated Total</p>
                    <p className="text-3xl font-black tracking-tighter">${total.toFixed(2)}</p>
                  </div>
                  <p className="text-[9px] text-gray-600 font-black uppercase text-right tracking-widest">
                    FREE EXPRESS<br />SHIPPING APPLIED
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    handleShopifyCheckout();
                    onClose();
                  }}
                  className="flex items-center justify-center w-full bg-white text-black py-6 rounded-2xl font-black text-xs tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all duration-500 text-center uppercase shadow-2xl hover:shadow-blue-500/20"
                >
                  PROCEED TO CHECKOUT
                </button>
                
                <p className="text-[9px] text-center text-gray-700 font-black tracking-[0.3em] uppercase">
                  Secure 256-bit encrypted checkout
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
