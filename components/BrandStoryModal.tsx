
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
              <p className="text-lg md:text-xl font-medium">
                Born from the streets, forged in authenticity. XO Club emerged from a simple truth: 
                <span className="text-white font-bold"> streetwear shouldn't be disposable</span>. 
                It should be built to last, designed to inspire, and crafted for those who refuse to follow.
              </p>

              <div className="border-l-4 border-blue-500 pl-6 space-y-4">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">THE BEGINNING</h3>
                <p className="text-base md:text-lg">
                  It started in 2018, in a small studio apartment where two friends—one a designer, 
                  the other a street photographer—decided the industry needed a reset. While others 
                  chased trends, we built a philosophy: <span className="text-white font-semibold">quality over everything</span>. 
                  Every stitch, every fabric choice, every design decision was made with one question: 
                  "Will this survive the hype?"
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">THE REBELLION</h3>
                <p className="text-base md:text-lg">
                  We watched fast fashion flood the streets. We saw quality sacrificed for quantity. 
                  We witnessed culture commodified. And we said <span className="text-white font-semibold">no</span>.
                </p>
                <p className="text-base md:text-lg">
                  XO Club became our answer. Not just clothing—a statement. A commitment to pieces 
                  that don't fade when the season changes. Garments that tell a story. Designs that 
                  respect the culture they're born from.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">THE STANDARD</h3>
                <p className="text-base md:text-lg">
                  Every drop is limited. Every piece is intentional. We don't flood the market—we 
                  curate. We don't follow—we <span className="text-white font-semibold">lead</span>.
                </p>
                <p className="text-base md:text-lg">
                  Our 300GSM organic cotton tees? They're not just shirts—they're canvases. Our 
                  tech-wear pieces? Not just fashion—function meets form. Every design is tested, 
                  refined, and released only when it meets our uncompromising standard.
                </p>
              </div>

              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-xl md:text-2xl font-black text-blue-500 uppercase tracking-widest">THE MISSION</h3>
                <p className="text-lg md:text-xl font-medium text-white">
                  To create streetwear that survives the hype. To build a community that values 
                  quality over quantity. To prove that <span className="text-blue-500">elite pieces need no filler</span>.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">JOIN THE MOVEMENT</h3>
                <p className="text-base md:text-lg">
                  This isn't just a brand. It's a <span className="text-white font-semibold">movement</span>. A community of 
                  rebels, creators, and visionaries who refuse to settle. Who understand that true 
                  style isn't about what's trending—it's about what lasts.
                </p>
                <p className="text-base md:text-lg font-medium text-white">
                  Welcome to XO Club. Welcome to the next generation of streetwear.
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
