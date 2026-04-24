import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Resources from '../pages/Resources';
import Requests from '../pages/Requests';
import Allocations from '../pages/Allocations';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Dashboard Layout wrapper */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/allocations" element={<Allocations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
