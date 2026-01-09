
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
      {/* Background Text Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <span className="text-[40vw] font-black tracking-tighter leading-none select-none">
          XO
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Visual Media with Float Effect */}
        <div 
          className="relative w-[280px] h-[380px] md:w-[450px] md:h-[600px] mb-[-6rem] md:mb-[-12rem] transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotateX(${-mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
            alt="XO Club Streetwear Fit" 
            className="w-full h-full object-cover rounded-2xl shadow-2xl brightness-90 grayscale-[0.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-2xl" />
        </div>

        {/* Hero Headline - Teen Targeted */}
        <div className="max-w-4xl">
          <h1 className="text-[16vw] md:text-[12rem] font-black text-tight text-white mb-6 uppercase drop-shadow-2xl">
            STREET<br />
            ELITE
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-lg mx-auto mb-10 font-medium tracking-wide px-4 uppercase">
            ELITE PIECES. NO FILLER. <br />THE NEXT GEN OF STREETWEAR.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="group relative bg-white text-black px-12 py-5 font-black text-xs tracking-[0.2em] rounded-full overflow-hidden transition-all hover:pr-14 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95">
              <span className="relative z-10">GET IT NOW</span>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300" size={18} />
            </button>
            <button className="px-12 py-5 border border-white/20 text-white font-bold text-xs tracking-[0.2em] rounded-full hover:bg-white/5 transition-all uppercase active:scale-95">
              STYLE IT
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[9px] font-black tracking-[0.4em]">EXPLORE</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
