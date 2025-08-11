import React from 'react';
import './AdminPanel.css';

// Mock data for demonstration
const analyticsData = {
  totalOrders: 125,
  totalSales: 9850.50,
  rushHours: '1:00 PM - 2:00 PM',
  mostPopularItem: 'Masala Dosa',
};

const AdminPanel = () => {
  // In a real app, you would fetch this data from your backend
  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      
      {/* Analytics Section */}
      <section className="admin-section">
        <h2>Today's Analytics</h2>
        <div className="analytics-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{analyticsData.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p>₹{analyticsData.totalSales.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Busiest Hour</h3>
            <p>{analyticsData.rushHours}</p>
          </div>
          <div className="stat-card">
            <h3>Most Popular Item</h3>
            <p>{analyticsData.mostPopularItem}</p>
          </div>
        </div>
      </section>

      {/* Menu Management Section */}
      <section className="admin-section">
        <h2>Menu Management</h2>
        <div className="management-actions">
            <button>Add New Item</button>
            <button>Edit Existing Item</button>
        </div>
        {/* You would render a list of menu items here for editing/deleting */}
        <p className="placeholder-text">Menu item list and editing tools would appear here.</p>
      </section>

      {/* Staff Management Section */}
      <section className="admin-section">
        <h2>Staff Management</h2>
        <div className="management-actions">
            <button>Add New Staff</button>
            <button>Manage Roles</button>
        </div>
        <p className="placeholder-text">Staff list and role management tools would appear here.</p>
      </section>
    </div>
  );
};

export default AdminPanel;
