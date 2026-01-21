
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import SocialProof from '../components/SocialProof';
import BrandStoryModal from '../components/BrandStoryModal';
import { Product } from '../types';

interface HomeProps {
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
}

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'RETRO JORDAN 1 HIGH', 
    price: 25, 
    category: 'FOOTWEAR', 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Iconic high-top silhouette with premium leather construction. Classic colorway featuring the legendary Air Jordan design. High-top design for maximum support and timeless style. The ultimate sneaker for collectors and streetwear enthusiasts.', 
    sizes: ['8', '9', '10', '11', '12'],
    isNew: true,
    shopifyProductId: '8351909675178',
    shopifyHandle: 'retro-jordan-1-high',
    shopifyVariants: [
      { id: '47906037072042', title: '8', price: 25, available: true, size: '8' },
      { id: '47906037104810', title: '9', price: 25, available: true, size: '9' },
      { id: '47906037137578', title: '10', price: 25, available: true, size: '10' },
      { id: '47906037170346', title: '11', price: 25, available: true, size: '11' },
      { id: '47906037203114', title: '12', price: 25, available: true, size: '12' },
    ]
  },
  { 
    id: '2', 
    name: 'SUPREME BOX LOGO HOODIE', 
    price: 25, 
    category: 'FLEECE', 
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Premium heavyweight fleece hoodie featuring the iconic box logo. French terry cotton construction with brushed interior for ultimate comfort. Ribbed cuffs and hem, adjustable drawstring hood, and roomy front pocket. The streetwear essential that never goes out of style.', 
    sizes: ['M', 'L', 'XL', 'XXL'],
    isLimited: true,
    shopifyProductId: '8351919276202',
    shopifyHandle: 'supreme-box-logo-hoodie',
    shopifyVariants: [
      { id: '47906048278698', title: 'M', price: 25, available: true, size: 'M' },
      { id: '47906048311466', title: 'L', price: 25, available: true, size: 'L' },
      { id: '47906048344234', title: 'XL', price: 25, available: true, size: 'XL' },
      { id: '47906048377002', title: '2XL', price: 25, available: true, size: 'XXL' },
    ]
  },
  { 
    id: '3', 
    name: 'TRAVIS SCOTT CACTUS JACK BEANIE', 
    price: 25, 
    category: 'ACCESSORIES', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Cactus Jack branded beanie with embroidered logo. Soft acrylic knit construction with stretch fit. One size fits most. Folded cuff design for versatile styling. The perfect accessory to complete any streetwear fit. Limited edition collaboration piece.', 
    sizes: ['ONE SIZE'],
    isNew: true,
    shopifyProductId: '8351920455850',
    shopifyHandle: 'travis-scott-cactus-jack-beanie',
    shopifyVariants: [
      { id: '47906123022506', title: 'ONE SIZE', price: 25, available: true, size: 'ONE SIZE' },
    ]
  },
  { 
    id: '4', 
    name: 'NORTH FACE RECON BACKPACK', 
    price: 25, 
    category: 'ACCESSORIES', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Durable 30L capacity backpack built for urban adventures. Water-resistant 600D recycled polyester construction. Padded laptop compartment, multiple organization pockets, and adjustable shoulder straps. Front bungee cord and top haul handle. The ultimate everyday carry for city life and beyond.', 
    sizes: ['ONE SIZE'],
    isLimited: true,
    shopifyProductId: '8351921242282',
    shopifyHandle: 'northface-recon-backpack',
    shopifyVariants: [
      { id: '47906124103850', title: 'ONE SIZE', price: 25, available: true, size: 'ONE SIZE' },
    ]
  },
];

const Home: React.FC<HomeProps> = ({ onPreview, onAddToCart, favorites, onToggleFavorite }) => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

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
          <Link to="/shop" className="text-xs font-black tracking-[0.4em] text-white border-b border-white/20 pb-3 hover:text-blue-500 hover:border-blue-500 transition-all uppercase">
            SHOP THE DROP
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onPreview={onPreview} 
              onAddToCart={onAddToCart}
              isFavorited={favorites.some(f => f.id === product.id)}
              onToggleFavorite={onToggleFavorite}
            />
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
            <button 
              onClick={() => setIsStoryModalOpen(true)}
              className="bg-white text-black px-12 py-5 rounded-full font-black text-xs tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all duration-500 uppercase active:scale-95 shadow-2xl"
            >
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

      <BrandStoryModal 
        isOpen={isStoryModalOpen} 
        onClose={() => setIsStoryModalOpen(false)} 
      />
    </div>
  );
};

export default Home;
