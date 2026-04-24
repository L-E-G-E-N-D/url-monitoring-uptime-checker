import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import FeatureStrip from '../components/landing/FeatureStrip';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import AuthModal from '../components/landing/AuthModal';

export default function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const openAuth = (mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-lime-400 to-blue-500 p-4 md:p-8 font-sans flex flex-col">
      {/* Inner Screen Container */}
      <div className="flex-1 w-full bg-black text-slate-200 rounded-[2rem] md:rounded-[3rem] overflow-x-hidden overflow-y-auto relative shadow-2xl flex flex-col">
        
        <Navbar onOpenAuth={() => openAuth('login')} />
        
        <main className="flex-1">
          <Hero onOpenAuth={() => openAuth('signup')} />
          <FeatureStrip />
          <FeaturesGrid />
          <CTA onOpenAuth={() => openAuth('signup')} />
        </main>
        
        <Footer />
        
        {isAuthModalOpen && (
          <AuthModal 
            onClose={() => setIsAuthModalOpen(false)} 
            initialMode={authModalMode}
          />
        )}
      </div>
    </div>
  );
}
