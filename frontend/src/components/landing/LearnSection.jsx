import React from 'react';

export default function LearnSection() {
  const learningPoints = [
    {
      title: "How Keep-Alive Works",
      desc: "Cloud platforms like Render or Railway put free services to sleep after 15 minutes of inactivity. Monitorly pings your URL at configured intervals, creating artificial activity that keeps your service awake and responsive 24/7."
    },
    {
      title: "Eliminating Cold Starts",
      desc: "Serverless functions (Vercel, AWS Lambda) can take seconds to boot up after periods of disuse. By maintaining a steady heartbeat of health checks, we ensure your functions stay 'warm', providing instant responses to your actual users."
    },
    {
      title: "Global Reliability",
      desc: "Availability isn't just about 'up or down'. We monitor from multiple global regions to detect localized outages or latency spikes, ensuring your application is performing optimally for users across the globe."
    }
  ];

  return (
    <section id="learn" className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Mastering <br /> High Availability
            </h2>
            <p className="text-slate-400 text-lg">
              Understanding the mechanics of modern hosting and how to optimize your infrastructure for zero downtime.
            </p>
          </div>
          
          <div className="lg:w-2/3 space-y-12">
            {learningPoints.map((point, i) => (
              <div key={i} className="group">
                <div className="flex gap-6">
                  <span className="text-[#ccff00] font-mono text-xl pt-1">0{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#ccff00] transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-lg">
                      {point.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
