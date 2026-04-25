import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Shield, Globe, Activity, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-base text-gray-100 font-sans selection:bg-accent-primary/30 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-20%] md:left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent-primary/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] md:right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#1C3A5E]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-dark-base/80 backdrop-blur-md border-b border-dark-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-accent-primary" size={32} />
              <h1 className="text-xl md:text-2xl font-syne font-bold text-gray-100 tracking-wide">
                ResQ<span className="text-accent-primary">Map</span>
              </h1>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Operator Login
              </Link>
              <Link to="/dashboard" className="btn-primary py-2 px-6 text-sm font-medium shadow-lg shadow-accent-primary/20">
                Access Dashboard
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-surface border-b border-dark-border animate-fade-in absolute w-full shadow-2xl">
            <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
              <Link 
                to="/login" 
                className="text-base font-medium text-gray-300 hover:text-white transition-colors p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Operator Login
              </Link>
              <Link 
                to="/dashboard" 
                className="btn-primary py-3 px-4 text-center text-sm font-medium shadow-lg shadow-accent-primary/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Access Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center relative z-10 animate-fade-in w-full max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs md:text-sm font-medium tracking-wide mb-8 md:mb-10 shadow-inner">
          <Activity size={16} className="animate-pulse" />
          Tactical Command Center v3.0
        </div>
        
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-syne font-bold text-white max-w-5xl leading-[1.1] md:leading-tight mb-6 md:mb-8 drop-shadow-2xl">
          Intelligent Disaster <br className="hidden sm:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-blue-400 to-accent-primary bg-300% animate-gradient">
            Resource Allocation
          </span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
          Real-time tracking, AI-driven deployment, and secure coordination for emergency responders and tactical operators on the ground.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link to="/dashboard" className="btn-primary py-4 px-8 text-base md:text-lg font-medium flex items-center justify-center gap-3 group shadow-xl shadow-accent-primary/20 hover:shadow-accent-primary/40 transition-all duration-300">
            Launch System
            <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
          </Link>
          <Link to="/login" className="glass-card py-4 px-8 text-base md:text-lg font-medium text-white hover:bg-dark-surface/80 transition-colors border border-gray-700/50 flex items-center justify-center">
            Operator Login
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-20 md:mt-32 w-full text-left">
          <div className="glass-card p-6 md:p-8 border-t border-t-accent-primary/30 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="bg-accent-primary/10 p-3 rounded-lg inline-block mb-5">
              <Globe className="text-accent-primary" size={28} />
            </div>
            <h3 className="text-xl md:text-2xl font-syne font-bold text-white mb-3">Live Heatmaps</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">Visualize critical zones and resource distribution instantly across affected regions with precision mapping.</p>
          </div>
          <div className="glass-card p-6 md:p-8 border-t border-t-blue-400/30 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="bg-blue-400/10 p-3 rounded-lg inline-block mb-5">
              <Activity className="text-blue-400" size={28} />
            </div>
            <h3 className="text-xl md:text-2xl font-syne font-bold text-white mb-3">Dynamic Allocation</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">Automated matching of supplies, shelter, and medical kits to pending distress requests using smart routing.</p>
          </div>
          <div className="glass-card p-6 md:p-8 border-t border-t-purple-400/30 hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            <div className="bg-purple-400/10 p-3 rounded-lg inline-block mb-5">
              <Shield className="text-purple-400" size={28} />
            </div>
            <h3 className="text-xl md:text-2xl font-syne font-bold text-white mb-3">Secure Sync</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">JWT-encrypted endpoints and isolated database architectures ensure mission-critical data integrity.</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full border-t border-dark-border bg-dark-surface/50 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-accent-primary/80" size={20} />
              <span className="font-syne font-bold text-gray-300">ResQMap AidSync</span>
            </div>
            
            <p className="text-sm text-gray-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} ResQMap Global Response. All systems operational.
            </p>
            
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-accent-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-accent-primary transition-colors">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
