import React, { useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { createShopifyCheckoutUrlForCart, getVariantId } from '../lib/shopify';

interface ShopifyCheckoutProps {
  cart: CartItem[];
  onComplete?: () => void;
}

const ShopifyCheckout: React.FC<ShopifyCheckoutProps> = ({ cart, onComplete }) => {
  const checkoutButtonRef = useRef<HTMLButtonElement>(null);

  const handleCheckout = () => {
    // Build cart items with variant IDs
    const checkoutItems = cart
      .map((item) => {
        const variantId = getVariantId(item, item.selectedSize);
        if (!variantId) {
          console.warn(`⚠️ No variant ID found for ${item.name} - ${item.selectedSize}`);
          return null;
        }

        // Extract Shopify variant ID (remove "gid://shopify/ProductVariant/")
        const cleanVariantId = variantId.replace('gid://shopify/ProductVariant/', '');
        
        return {
          variantId: cleanVariantId,
          quantity: item.quantity,
        };
      })
      .filter((item): item is { variantId: string; quantity: number } => item !== null);

    if (checkoutItems.length === 0) {
      alert('No valid items in cart. Please ensure all products are synced to Shopify.');
      return;
    }

    // Create Shopify checkout URL
    const checkoutUrl = createShopifyCheckoutUrlForCart(checkoutItems);
    
    // Redirect to Shopify checkout
    window.location.href = checkoutUrl;
  };

  return (
    <button
      ref={checkoutButtonRef}
      onClick={handleCheckout}
      className="group flex items-center justify-center gap-4 w-full bg-white text-black py-6 rounded-[1.5rem] font-black text-xs tracking-[0.4em] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
    >
      Proceed to Checkout
      <svg 
        className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

export default ShopifyCheckout;
