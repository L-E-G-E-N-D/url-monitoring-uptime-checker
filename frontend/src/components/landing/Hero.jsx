import React from 'react';
import Hero3D from './Hero3D';

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
            Ensure continuous responsiveness and eliminate inactivity-driven downtime with our advanced monitoring and health check suite.
          </p>

          <div className="pt-4">
            <button 
              onClick={onOpenAuth}
              className="px-10 py-4 text-lg font-semibold text-black bg-gradient-to-r from-[#ccff00] to-[#e6ff00] rounded-full hover:brightness-110 transition-all cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end relative h-[600px] w-full mt-20 lg:mt-0">
          <Hero3D />
        </div>

      </div>
    </section>
  );
}
