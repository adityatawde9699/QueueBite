import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = ({ allowedRoles }) => {
  // Call isLoggedIn as a function
  const { user, isLoggedIn } = useAuthStore();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role is included in the allowedRoles array
  // user.is_staff_member is returned by API serializer (not nested profile object)
  const hasRequiredRole = allowedRoles.some(role => user?.is_staff_member === role);

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
