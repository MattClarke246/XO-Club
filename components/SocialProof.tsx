
import React from 'react';

const SocialProof: React.FC = () => {
  const socialImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
    { id: 2, url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800' },
    { id: 3, url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800' },
    { id: 4, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
    { id: 5, url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800' },
    { id: 6, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <section className="py-32 overflow-hidden bg-black/50">
      <div className="container mx-auto px-6 mb-16">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">JOIN THE CLUB</h2>
        <p className="text-gray-500 max-w-xl">Our community sets the pace. Tag <span className="text-white font-bold">#XOClub</span> to be featured in the global archive.</p>
      </div>

      {/* Marquee Animation */}
      <div className="flex w-full overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...socialImages, ...socialImages].map((img, idx) => (
            <div key={`${img.id}-${idx}`} className="w-[200px] h-[250px] md:w-[300px] md:h-[400px] px-2 flex-shrink-0 group">
              <div className="w-full h-full relative overflow-hidden rounded-xl grayscale hover:grayscale-0 transition-all duration-700">
                <img src={img.url} alt="XO Club Community Member" className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="text-[10px] font-black tracking-widest text-white border border-white px-4 py-2 rounded-full">SHOP FIT</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </section>
  );
};

export default SocialProof;
