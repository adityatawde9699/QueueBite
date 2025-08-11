import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Page Components
import CanteenPage from '../pages/CanteenPage';
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import StaffQueuePage from '../pages/StaffQueuePage';
import PlaceOrder from '../pages/PlaceOrder';
import OrderQueue from '../pages/OrderQueue';
import AdminPanel from '../pages/AdminPanel';

// Import Private Route Component
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />

      {/* Home Page (accessible to all) */}
      <Route path="/" element={<CanteenPage />} />

      {/* Protected Routes for Regular Users (is_staff_member: false) */}
      <Route element={<PrivateRoute allowedRoles={[false]} />}>
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order-queue" element={<OrderQueue />} />
      </Route>

      {/* Protected Routes for Staff/Admin (is_staff_member: true) */}
      <Route element={<PrivateRoute allowedRoles={[true]} />}>
        <Route path="/staff/queue" element={<StaffQueuePage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      {/* Fallback for unknown routes */}
      <Route 
        path="*" 
        element={
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404: Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </div>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
