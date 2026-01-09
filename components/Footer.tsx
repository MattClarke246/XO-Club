
import React from 'react';
import { Instagram, Twitter, Youtube, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-24">
          
          <div className="col-span-2 lg:col-span-2">
            <a href="#/" className="text-3xl font-black tracking-tighter mb-8 block">XO CLUB<span className="text-blue-500">.</span></a>
            <p className="text-gray-500 max-w-xs mb-8 text-sm leading-relaxed font-light">
              Designing the future of urban luxury. Inspired by culture, driven by creativity.
            </p>
            <div className="flex items-center space-x-6 text-gray-500">
              <Instagram size={20} className="hover:text-white transition-colors cursor-pointer" />
              <Twitter size={20} className="hover:text-white transition-colors cursor-pointer" />
              <Youtube size={20} className="hover:text-white transition-colors cursor-pointer" />
              <Github size={20} className="hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-widest text-white mb-8 uppercase">SHOP</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Men's Apparel</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Women's Apparel</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-widest text-white mb-8 uppercase">COMMUNITY</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lookbook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Collaborations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">The Lab</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-widest text-white mb-8 uppercase">HELP</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-widest text-white mb-8 uppercase">LEGAL</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">
            © 2025 XO CLUB LTD. ALL RIGHTS RESERVED.
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
