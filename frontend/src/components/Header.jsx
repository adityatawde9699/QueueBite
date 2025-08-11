import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Assuming zustand store is in this path
import './Header.css';
const Header = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <img src="/logo.svg" alt="logo" />
        </Link>
        <nav className="header-nav">
          {isLoggedIn ? (
            <>
              <span className="welcome-user">Welcome, {user?.username}!</span>
              {user?.is_staff_member ? (
                <>
                  <Link to="/staff/queue" className="header-link">
                    Dashboard
                  </Link>
                  <Link to="/admin" className="header-link">
                    Admin Panel
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/place-order" className="header-link">
                    Place Order
                  </Link>
                  <Link to="/order-queue" className="header-link">
                    My Queue
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="header-button logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-link">
                Login
              </Link>
              <Link to="/register" className="header-button">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
