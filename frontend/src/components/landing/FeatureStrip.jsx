import React from 'react';

export default function FeatureStrip() {
  const features = [
    { label: "Real-time monitoring", icon: "⚡️" },
    { label: "Multi-region checks", icon: "🌍" },
    { label: "Analytics dashboard", icon: "📊" },
    { label: "Instant alerts", icon: "🔔" }
  ];

  return (
    <div className="w-full border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
              <span className="text-2xl opacity-80">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
