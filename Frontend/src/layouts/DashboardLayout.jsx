import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, Share2, LogOut, Bell } from 'lucide-react';

const DashboardLayout = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resources', path: '/resources', icon: Package },
    { name: 'Requests', path: '/requests', icon: ClipboardList },
    { name: 'Allocations', path: '/allocations', icon: Share2 },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-border flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Share2 className="w-6 h-6" />
            <span>AidSync</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-sidebar-hover'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-foreground hover:bg-sidebar-hover hover:text-danger transition-colors duration-200">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-semibold text-foreground"></h2>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-sidebar-hover text-foreground relative transition-colors duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                A
              </div>
              <span className="text-sm font-medium text-foreground hidden md:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-background/50 p-6">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
