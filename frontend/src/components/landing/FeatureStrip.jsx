import React from 'react';

export default function FeatureStrip() {
  const features = [
    { 
      label: "Real-time monitoring", 
      icon: (
        <svg className="w-5 h-5 text-[#ccff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      label: "Multi-region checks", 
      icon: (
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 013 3V16.5m-3-10.5h.5a2 2 0 012 2 2 2 0 01-2 2h-1c-1.1 0-2 .9-2 2v.5m0-10a9 9 0 11-9 9 9 9 0 019-9z" />
        </svg>
      )
    },
    { 
      label: "Analytics dashboard", 
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      label: "Instant alerts", 
      icon: (
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    }
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
