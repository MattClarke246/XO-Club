import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface ShopifyBuyButtonProps {
  productId?: string;
  variantId?: string;
  quantity?: number;
  storeName: string;
  className?: string;
  children?: React.ReactNode;
}

const ShopifyBuyButton: React.FC<ShopifyBuyButtonProps> = ({
  productId,
  variantId,
  quantity = 1,
  storeName,
  className = '',
  children,
}) => {
  const handleCheckout = () => {
    if (variantId) {
      // Direct checkout with specific variant
      window.location.href = `https://${storeName}.myshopify.com/cart/${variantId}:${quantity}`;
    } else if (productId) {
      // Redirect to product page if no variant ID
      window.location.href = `https://${storeName}.myshopify.com/products/${productId}`;
    } else {
      // Fallback to store homepage
      window.location.href = `https://${storeName}.myshopify.com`;
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className={className || "w-full bg-white text-black px-8 py-4 rounded-full font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-2xl"}
    >
      {children || (
        <>
          <ShoppingBag size={16} className="inline mr-2" />
          BUY NOW
        </>
      )}
    </button>
  );
};

export default ShopifyBuyButton;
