import React from 'react';

export default function FeaturesGrid() {
  const features = [
    {
      title: "Multi-region monitoring",
      desc: "Check your endpoints from multiple global locations to ensure worldwide availability.",
      icon: "🌍"
    },
    {
      title: "Uptime analytics",
      desc: "Detailed historical data and SLA reporting to keep your stakeholders informed.",
      icon: "📈"
    },
    {
      title: "Smart alerts",
      desc: "Get notified instantly via Email or Webhooks before your customers notice.",
      icon: "⚡"
    },
    {
      title: "Secure cron system",
      desc: "Reliable background jobs running on a distributed architecture to guarantee precision.",
      icon: "🔒"
    },
    {
      title: "Queue-based processing",
      desc: "High-throughput message queues handle thousands of checks simultaneously.",
      icon: "⚡"
    },
    {
      title: "Serverless backend",
      desc: "Built on modern edge infrastructure for infinite scalability and zero downtime.",
      icon: "☁️"
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
