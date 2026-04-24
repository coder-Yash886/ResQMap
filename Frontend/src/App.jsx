
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AuthGuard from './components/AuthGuard';
import ToastConfig from './components/Toast';
import Sidebar from './components/Sidebar';
import EmergencyBanner from './components/EmergencyBanner';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateResource from './pages/CreateResource';
import ResourceDetail from './pages/ResourceDetail';
import FilterPage from './pages/FilterPage';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-dark-base text-gray-100 font-sans selection:bg-accent-primary/30">
      <EmergencyBanner />
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 md:ml-64 w-full">
          {/* Mobile top spacing */}
          <div className="h-16 md:hidden"></div>
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
              <Route index element={<Dashboard />} />
              <Route path="create" element={<CreateResource />} />
              <Route path="resources/:id" element={<ResourceDetail />} />
              <Route path="search" element={<FilterPage />} />
            </Route>
          </Routes>
        </Router>
        <ToastConfig />
      </AuthProvider>
    </ErrorBoundary>
  );
};


export default App;
