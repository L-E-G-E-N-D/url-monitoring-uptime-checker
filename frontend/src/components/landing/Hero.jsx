import React from 'react';

export default function Hero({ onOpenAuth }) {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-12 z-10">

        
        <div className="flex-1 max-w-[650px] space-y-8">
          <h1 className="text-5xl md:text-[70px] font-medium tracking-tight text-white leading-[1.1]">
            Empowering <br />
            Your Journey in <br />
            the Digital Space
          </h1>
          
          <p className="text-lg text-slate-400 max-w-[500px] leading-relaxed">
            Explore comprehensive uptime tracking and instant alerts with our advanced monitoring platform.
          </p>

          <div className="pt-4">
            <button 
              onClick={onOpenAuth}
              className="px-10 py-4 text-lg font-semibold text-black bg-gradient-to-r from-[#ccff00] to-[#e6ff00] rounded-full hover:brightness-110 transition-all cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              Launch app
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end relative h-[400px] w-full mt-20 lg:mt-0 [perspective:1000px]">
          <div className="relative w-48 h-48 md:w-64 md:h-64 [transform-style:preserve-3d] animate-spin-3d mr-0 lg:mr-20">
            
            {/* Front */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/40 to-[#00ffcc]/20 border border-white/40 backdrop-blur-md shadow-[0_0_50px_rgba(204,255,0,0.3)] rounded-2xl flex items-center justify-center" style={{ transform: 'translateZ(128px)' }}>
              <div className="w-1/2 h-1/2 rounded-full bg-[#ccff00]/60 blur-xl" />
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-pink-500/20 border border-white/40 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.3)] rounded-2xl flex items-center justify-center" style={{ transform: 'rotateY(180deg) translateZ(128px)' }}>
              <div className="w-1/2 h-1/2 rounded-full bg-purple-500/60 blur-xl" />
            </div>
            
            {/* Right */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-blue-500/20 border border-white/40 backdrop-blur-md shadow-[0_0_50px_rgba(34,211,238,0.3)] rounded-2xl flex items-center justify-center" style={{ transform: 'rotateY(90deg) translateZ(128px)' }}>
              <div className="w-1/2 h-1/2 rounded-full bg-cyan-400/60 blur-xl" />
            </div>
            
            {/* Left */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-indigo-500/20 border border-white/40 backdrop-blur-md shadow-[0_0_50px_rgba(59,130,246,0.3)] rounded-2xl flex items-center justify-center" style={{ transform: 'rotateY(-90deg) translateZ(128px)' }}>
              <div className="w-1/2 h-1/2 rounded-full bg-blue-500/60 blur-xl" />
            </div>
            
            {/* Top */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/40 to-rose-500/20 border border-white/40 backdrop-blur-md shadow-[0_0_50px_rgba(236,72,153,0.3)] rounded-2xl flex items-center justify-center" style={{ transform: 'rotateX(90deg) translateZ(128px)' }}>
              <div className="w-1/2 h-1/2 rounded-full bg-pink-500/60 blur-xl" />
            </div>
            
            {/* Bottom */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/40 to-orange-500/20 border border-white/40 backdrop-blur-md shadow-[0_0_50px_rgba(253,224,71,0.3)] rounded-2xl flex items-center justify-center" style={{ transform: 'rotateX(-90deg) translateZ(128px)' }}>
              <div className="w-1/2 h-1/2 rounded-full bg-yellow-300/60 blur-xl" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
