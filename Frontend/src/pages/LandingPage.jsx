import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Shield, Globe, Activity, Menu, X, Mail, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate sending message
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setContactForm({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

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
              <a href="#contact" onClick={scrollToContact} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
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
              <a 
                href="#contact" 
                onClick={scrollToContact}
                className="text-base font-medium text-gray-300 hover:text-white transition-colors p-2"
              >
                Contact
              </a>
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

        {/* Contact Section */}
        <div id="contact" className="mt-32 w-full max-w-4xl mx-auto text-left scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-syne font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-gray-400">Have questions about deployment or integration? Send us a message.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="glass-card p-6 border-l-4 border-l-accent-primary flex items-start gap-4">
                <div className="bg-accent-primary/10 p-3 rounded-lg">
                  <Mail className="text-accent-primary" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Direct Contact</h4>
                  <a href="mailto:contact@resqmap.com" className="text-gray-400 hover:text-accent-primary transition-colors">contact@resqmap.com</a>
                </div>
              </div>

              <div className="glass-card p-6 border-l-4 border-l-[#0077b5] flex items-start gap-4">
                <div className="bg-[#0077b5]/10 p-3 rounded-lg">
                  <LinkedinIcon className="text-[#0077b5]" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">LinkedIn</h4>
                  <a href="https://www.linkedin.com/in/yash-kumar-2a7076325" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors break-all">
                    linkedin.com/in/yash-kumar-2a7076325
                  </a>
                </div>
              </div>

              <div className="glass-card p-6 border-l-4 border-l-gray-300 flex items-start gap-4">
                <div className="bg-gray-300/10 p-3 rounded-lg">
                  <GithubIcon className="text-gray-300" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">GitHub</h4>
                  <a href="https://github.com/coder-Yash886" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors break-all">
                    github.com/coder-Yash886
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="input-field" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="input-field" 
                  placeholder="john@example.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea 
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="input-field min-h-[120px] resize-y" 
                  placeholder="How can we help you?" 
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full border-t border-dark-border bg-dark-surface/50 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-accent-primary/80" size={20} />
                <span className="font-syne font-bold text-gray-300 text-lg">ResQMap AidSync</span>
              </div>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Yash Kumar. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="https://github.com/coder-Yash886" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <GithubIcon size={24} />
              </a>
              <a href="https://www.linkedin.com/in/yash-kumar-2a7076325" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors" aria-label="LinkedIn">
                <LinkedinIcon size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
