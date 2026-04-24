import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onOpenAuth }) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L10 6" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" />
            <path d="M10 20L16 8" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 22L22 10" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-medium text-white tracking-wide">
            Monitorly
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[15px] font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Services</a>
          <a href="#learn" className="hover:text-white transition-colors">Learn</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center">
          <button 
            onClick={onOpenAuth}
            className="px-6 py-2.5 text-[15px] font-semibold text-black bg-white rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
