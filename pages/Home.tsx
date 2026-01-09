
import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import SocialProof from '../components/SocialProof';
import { Product } from '../types';

interface HomeProps {
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'MONOLITH OVERSIZED TEE', 
    price: 65, 
    category: 'ESSENTIALS', 
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Heavyweight 300GSM organic cotton. Boxy fit. Dropped shoulders. The essential base for every fit.', 
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true 
  },
  { 
    id: '2', 
    name: 'PHANTOM UTILITY PANTS', 
    price: 155, 
    category: 'BOTTOMS', 
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Tech-wear inspired silhouette. Multi-pocket design. Reinforced water-resistant panels.', 
    sizes: ['30', '32', '34', '36'],
    isLimited: true 
  },
  { 
    id: '3', 
    name: 'CYBER-CORE HOODIE', 
    price: 125, 
    category: 'FLEECE', 
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Ultra-heavy 500GSM fleece. Thermal lining. Distressed edges for a raw aesthetic.', 
    sizes: ['M', 'L', 'XL', 'XXL'],
    isNew: true
  },
  { 
    id: '4', 
    name: 'GLITCH NYLON VEST', 
    price: 195, 
    category: 'OUTERWEAR', 
    image: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Reflective nylon finish. Adjustable tactical straps. Breathable mesh back.', 
    sizes: ['S', 'M', 'L'],
    isLimited: true 
  },
];

const Home: React.FC<HomeProps> = ({ onPreview, onAddToCart }) => {
  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Featured Drop Section */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-6xl md:text-8xl font-black text-tight mb-6 uppercase">NEW<br />CURATION</h2>
            <p className="text-blue-500 font-black tracking-[0.3em] uppercase text-xs">DROP 042 // WINTER ARCHIVE</p>
          </div>
          <a href="#/shop" className="text-xs font-black tracking-[0.4em] text-white border-b border-white/20 pb-3 hover:text-blue-500 hover:border-blue-500 transition-all uppercase">
            SHOP THE DROP
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onPreview={onPreview} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* High-Concept Editorial Banner */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1920" className="absolute inset-0 w-full h-full object-cover brightness-[0.3] grayscale-[0.5]" alt="Editorial" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl glass p-10 md:p-16 rounded-3xl border-white/10">
            <h3 className="text-blue-500 font-black tracking-[0.4em] text-[10px] mb-6 uppercase">THE XO MANIFESTO</h3>
            <h2 className="text-5xl md:text-8xl font-black text-tight mb-8 uppercase leading-[0.85]">BUILT FOR<br />THE REBEL</h2>
            <p className="text-gray-300 text-lg md:text-xl mb-10 font-medium leading-relaxed uppercase">
              QUALITY OVER EVERYTHING. <br />STREETWEAR THAT SURVIVES THE HYPE.
            </p>
            <button className="bg-white text-black px-12 py-5 rounded-full font-black text-xs tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all duration-500 uppercase active:scale-95 shadow-2xl">
              OUR STORY
            </button>
          </div>
        </div>
      </section>

      <SocialProof />

      {/* Newsletter Capture */}
      <section className="py-40 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-6xl md:text-9xl font-black text-tight mb-10 uppercase">DONT<br />MISS OUT.</h2>
          <p className="text-gray-500 mb-14 max-w-xl mx-auto font-bold tracking-widest uppercase text-sm">
            EARLY ACCESS + VIP DROPS. JOIN THE CLUB.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-10 py-6 text-white focus:outline-none focus:border-blue-500 transition-all text-xs tracking-widest font-black uppercase"
            />
            <button className="bg-white text-black px-12 py-6 rounded-full font-black text-xs tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all duration-300 uppercase shadow-2xl">
              JOIN
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
