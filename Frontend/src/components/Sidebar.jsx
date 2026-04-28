import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  AlertTriangle,
  ClipboardList,
  Siren
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Create Resource', path: '/create', icon: PlusCircle },
    { name: 'Search & Filter', path: '/search', icon: Search },
    { name: 'Raise a Need', path: '/raise-request', icon: AlertTriangle },
    { name: 'Requests Board', path: '/requests', icon: ClipboardList },
    { name: 'Emergency', path: '/emergency', icon: Siren },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-dark-base border-r border-dark-border">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <ShieldAlert className="text-accent-primary" size={32} />
        <h1 className="text-xl font-syne font-bold text-gray-100 tracking-wide">
          ResQ<span className="text-accent-primary">Map</span>
        </h1>
      </div>

      {/* Nav Links */}
      <div className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isEmergency = item.path === '/emergency';
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? isEmergency
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                  : isEmergency
                    ? 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-dark-surface'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={20} />
              <span className="font-sans font-medium">{item.name}</span>
              {isEmergency && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: '0.55rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', letterSpacing: '0.05em' }}>
                  LIVE
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-sans font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header & Hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark-base border-b border-dark-border fixed top-0 w-full z-40">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-accent-primary" size={24} />
          <span className="font-syne font-bold text-lg">ResQMap</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-300">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="w-64 h-full pt-16">
            {sidebarContent}
          </div>
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
