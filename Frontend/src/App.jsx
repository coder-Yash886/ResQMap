import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ErrorBoundary from './components/ErrorBoundary';
import AuthGuard from './components/AuthGuard';
import ToastConfig from './components/Toast';
import Sidebar from './components/Sidebar';
import EmergencyBanner from './components/EmergencyBanner';
import NeedRaiseModal from './components/NeedRaiseModal';
import NotificationBell from './components/NotificationBell';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateResource from './pages/CreateResource';
import ResourceDetail from './pages/ResourceDetail';
import FilterPage from './pages/FilterPage';
import RaiseRequest from './pages/RaiseRequest';
import RequestsBoard from './pages/RequestsBoard';
import EmergencyPage from './pages/EmergencyPage';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-dark-base text-gray-100 font-sans selection:bg-accent-primary/30">
      <EmergencyBanner />
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        
        {/* Adjusted margin to 200px to match new sidebar width */}
        <main className="flex-1 md:ml-[200px] w-full transition-all duration-300">
          {/* Mobile top spacing */}
          <div className="h-16 md:hidden"></div>

          {/* Top bar with NotificationBell */}
          <div style={{ 
              position: 'sticky', 
              top: 0, 
              zIndex: 10, 
              background: 'rgba(8,12,18,0.8)', 
              backdropFilter: 'blur(12px)', 
              borderBottom: '0.5px solid #141e2e', 
              padding: '10px 24px', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center' 
            }}
            className="hidden md:flex">
            <NotificationBell />
          </div>

          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Global floating raise-need button */}
      <NeedRaiseModal />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
                <Route index element={<Dashboard />} />
                <Route path="create" element={<CreateResource />} />
                <Route path="resources/:id" element={<ResourceDetail />} />
                <Route path="search" element={<FilterPage />} />
                <Route path="raise-request" element={<RaiseRequest />} />
                <Route path="requests" element={<RequestsBoard />} />
                <Route path="emergency" element={<EmergencyPage />} />
              </Route>
            </Routes>
          </Router>
          <ToastConfig />
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
