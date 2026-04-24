import React from 'react';

export default function CTA({ onOpenAuth }) {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 -z-10" />
      
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-8">
          <div className="px-6 py-2 rounded-full bg-[#0a0a0f] text-sm font-medium text-slate-300">
            Start for free, upgrade when you need
          </div>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
          Start monitoring your <br /> websites today
        </h2>
        
        <button 
          onClick={onOpenAuth}
          className="px-10 py-5 text-lg font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] cursor-pointer"
        >
          Create your account
        </button>
      </div>
    </section>
  );
}
