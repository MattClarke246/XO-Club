
import React from 'react';
import { X } from 'lucide-react';

interface BrandStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BrandStoryModal: React.FC<BrandStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300 my-8">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors text-white"
          aria-label="Close story"
        >
          <X size={24} />
        </button>

        <div className="relative">
          {/* Hero Image */}
          <div className="relative h-[300px] md:h-[400px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1920" 
              alt="XO Club Story" 
              className="w-full h-full object-cover brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-8 left-8 md:left-12 right-8">
              <h2 className="text-4xl md:text-6xl font-black text-tight mb-2 uppercase">OUR STORY</h2>
              <p className="text-blue-500 font-black tracking-[0.3em] text-xs uppercase">THE XO MANIFESTO</p>
            </div>
          </div>

          {/* Story Content */}
          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                <span className="text-white font-bold">Built from difference, not being comfortable with where you are.</span> This brand lives at the intersection of fashion, sport, and urban culture pushed beyond the limits of this world. Inspired by extraterrestrial energy, we design for those who move different, think different, and refuse to blend in.
              </p>

              <div className="border-l-4 border-blue-500 pl-6 space-y-4">
                <p className="text-base md:text-lg text-white font-semibold">
                  In a world where everything is accessible, XO Club was created for what isn't.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-base md:text-lg">
                  Born from the idea that <span className="text-white font-semibold">connection is currency and presence is power</span>. XO Club isn't just a brand—it's an experience reserved for those who move different.
                </p>
              </div>

              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-xl md:text-2xl font-black text-blue-500 uppercase tracking-widest">THE XO CODE</h3>
                <p className="text-lg md:text-xl font-medium text-white mb-4">
                  The XO represents more than a symbol, it's a code:
                </p>
                <div className="space-y-3 text-2xl font-black tracking-widest">
                  <div className="text-white"><span className="text-blue-500">X</span> = EXCLUSIVITY</div>
                  <div className="text-white"><span className="text-blue-500">O</span> = ORBIT</div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-xl md:text-3xl font-black text-white tracking-widest uppercase">
                  A circle of influence...<br/>
                  <span className="text-blue-500 text-2xl md:text-4xl block mt-4">You either belong or you don't.</span>
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 border-t border-white/10">
              <button 
                onClick={onClose}
                className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-full font-black text-xs tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all duration-500 uppercase active:scale-95 shadow-2xl"
              >
                EXPLORE THE DROP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStoryModal;
