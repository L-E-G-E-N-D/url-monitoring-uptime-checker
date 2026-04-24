import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
          
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              My Mission
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              I built Monitorly with a simple premise: developer-first monitoring that works as hard as you do. I believe that maintaining high availability shouldn't be a luxury or a manual chore.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed mb-12">
              Our platform empowers engineers to focus on building great products while we handle the continuous health checks, performance tracking, and uptime preservation. By bridging the gap between free-tier hosting and enterprise-grade reliability, we ensure that every project—big or small—stays responsive and accessible.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Built for Developers, by Developer
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
