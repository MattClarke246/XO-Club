
import React from 'react';
import { Instagram, Twitter, Youtube, Github } from 'lucide-react';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const handleDeadLink = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    toast.info(`${page} is coming soon.`, { description: 'Check back later.' });
  };

  return (
    <footer className="bg-[#050505] pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          
          <div className="col-span-2">
            <a href="#/" className="text-3xl font-black tracking-tighter mb-8 block">XO CLUB<span className="text-blue-500">.</span></a>
            <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed font-light">
              Small independent label—streetwear we stand behind. Orders finish on Shopify checkout.
            </p>
            <div className="flex items-center space-x-6 text-gray-500">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={20} className="hover:text-white transition-colors cursor-pointer" /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><Twitter size={20} className="hover:text-white transition-colors cursor-pointer" /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"><Youtube size={20} className="hover:text-white transition-colors cursor-pointer" /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer"><Github size={20} className="hover:text-white transition-colors cursor-pointer" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-widest text-white mb-8 uppercase">HELP</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" onClick={(e) => handleDeadLink(e, 'Track Order')} className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" onClick={(e) => handleDeadLink(e, 'Shipping')} className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" onClick={(e) => handleDeadLink(e, 'Returns')} className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" onClick={(e) => handleDeadLink(e, 'Contact Us')} className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-widest text-white mb-8 uppercase">LEGAL</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" onClick={(e) => handleDeadLink(e, 'Privacy Policy')} className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => handleDeadLink(e, 'Terms of Service')} className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" onClick={(e) => handleDeadLink(e, 'Cookie Policy')} className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">
            © 2026 XO CLUB LTD. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 grayscale opacity-30">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
