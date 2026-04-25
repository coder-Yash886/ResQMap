import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Shield, Globe, Activity } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-base text-gray-100 font-sans selection:bg-accent-primary/30 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-accent-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#1C3A5E]/30 rounded-full blur-[120px]" />

      {/* Navigation */}
      <nav className="p-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-accent-primary" size={32} />
          <h1 className="text-2xl font-syne font-bold text-gray-100 tracking-wide">
            ResQ<span className="text-accent-primary">Map</span>
          </h1>
        </div>
        <div>
          <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors mr-6">
            Operator Login
          </Link>
          <Link to="/dashboard" className="btn-primary py-2 px-5 text-sm">
            Access Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 animate-fade-in mt-12 md:mt-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-medium tracking-wide mb-8">
          <Activity size={16} />
          Tactical Command Center v3.0
        </div>
        
        <h2 className="text-5xl md:text-7xl font-syne font-bold text-white max-w-4xl leading-tight mb-6 drop-shadow-lg">
          Intelligent Disaster <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-blue-400">
            Resource Allocation
          </span>
        </h2>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Real-time tracking, AI-driven deployment, and secure coordination for emergency responders and tactical operators on the ground.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/dashboard" className="btn-primary py-4 px-8 text-lg flex items-center justify-center gap-2 group">
            Launch System
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
          <Link to="/login" className="glass-card py-4 px-8 text-lg font-medium text-white hover:bg-dark-surface/80 transition-colors border border-gray-700/50 flex items-center justify-center">
            Operator Login
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full text-left">
          <div className="glass-card p-6 border-t border-t-accent-primary/30">
            <Globe className="text-accent-primary mb-4" size={28} />
            <h3 className="text-xl font-syne font-bold text-white mb-2">Live Heatmaps</h3>
            <p className="text-gray-400 text-sm">Visualize critical zones and resource distribution instantly across the affected regions.</p>
          </div>
          <div className="glass-card p-6 border-t border-t-blue-400/30">
            <Activity className="text-blue-400 mb-4" size={28} />
            <h3 className="text-xl font-syne font-bold text-white mb-2">Dynamic Allocation</h3>
            <p className="text-gray-400 text-sm">Automated matching of supplies, shelter, and medical kits to pending distress requests.</p>
          </div>
          <div className="glass-card p-6 border-t border-t-purple-400/30">
            <Shield className="text-purple-400 mb-4" size={28} />
            <h3 className="text-xl font-syne font-bold text-white mb-2">Secure Sync</h3>
            <p className="text-gray-400 text-sm">JWT-encrypted endpoints and isolated database architectures ensure data integrity.</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-6 border-t border-dark-border mt-auto relative z-10 flex items-center justify-between text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} ResQMap AidSync. All systems operational.</p>
        <div className="flex gap-4">
          <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
