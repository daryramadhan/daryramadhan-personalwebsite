import React from 'react';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white pt-0 pb-12">
      <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-8">
        <div className="border-t border-white/20 pt-8 flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-8 md:gap-6">
          
          {/* Left: Copyright */}
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold tracking-tight">Dary Ramadhan</span>
            <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          {/* Center: Legal Links */}
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Conditions</a>
          </div>

          {/* Right: Back to Top */}
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors"
          >
            <span>Back to top</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
        
        {/* Big Name Watermark (Optional, adds style) */}
        <div className="mt-24 select-none pointer-events-none">
          <h1 className="text-[18vw] leading-none font-bold text-white/5 text-center tracking-tighter whitespace-nowrap overflow-hidden select-none pointer-events-none -mb-4 md:-mb-8">
            DARY RAMADHAN
          </h1>
        </div>
      </div>
    </footer>
  );
}
