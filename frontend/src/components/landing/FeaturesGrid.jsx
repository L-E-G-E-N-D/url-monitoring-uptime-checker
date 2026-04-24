import React from 'react';

export default function FeaturesGrid() {
  const features = [
    {
      title: "Multi-region monitoring",
      desc: "Check your endpoints from multiple global locations to ensure worldwide availability.",
      icon: (
        <svg className="w-6 h-6 text-[#ccff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 013 3V16.5m-3-10.5h.5a2 2 0 012 2 2 2 0 01-2 2h-1c-1.1 0-2 .9-2 2v.5m0-10a9 9 0 11-9 9 9 9 0 019-9z" />
        </svg>
      )
    },
    {
      title: "Uptime analytics",
      desc: "Detailed historical data and SLA reporting to keep your stakeholders informed.",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Smart alerts",
      desc: "Get notified instantly via Email or Webhooks before your customers notice.",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: "Secure infrastructure",
      desc: "Reliable background jobs running on a distributed architecture to guarantee precision.",
      icon: (
        <svg className="w-6 h-6 text-[#00ffcc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Zero-sleep monitoring",
      desc: "Uses continuous health checks to keep services responsive and minimize downtime caused by inactivity on free-tier hosting platforms.",
      icon: (
        <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Distributed Edge Checks",
      desc: "Our globally distributed task runners verify your site from multiple regions simultaneously.",
      icon: (
        <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 4.03 3 9s-1.343 9-3 9m0-18c-1.657 0-3 4.03-3 9s1.343 9 3 9m-9-9a9 9 0 019-9" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for scale and reliability</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Everything you need to monitor your infrastructure, packaged in a beautiful, lightning-fast interface.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-6 shadow-inner">
              {f.icon}
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
