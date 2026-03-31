import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './StaffQueuePage.css';

const STATUS_PIPELINE = ['Pending', 'In Progress', 'Ready', 'Served'];

const STATUS_META = {
  Pending: {
    label: 'Pending',
    next: 'In Progress',
    nextLabel: '▶ Start Cooking',
    color: '#ef4444',
    bg: '#fef2f2',
    badge: '#ef4444',
    icon: '🕐',
  },
  'In Progress': {
    label: 'In Progress',
    next: 'Ready',
    nextLabel: '✓ Mark Ready',
    color: '#f97316',
    bg: '#fff7ed',
    badge: '#f97316',
    icon: '🍳',
  },
  Ready: {
    label: 'Ready for Pickup',
    next: 'Served',
    nextLabel: '🎉 Mark Served',
    color: '#22c55e',
    bg: '#f0fdf4',
    badge: '#22c55e',
    icon: '✅',
  },
  Served: {
    label: 'Served',
    next: null,
    nextLabel: null,
    color: '#6b7280',
    bg: '#f9fafb',
    badge: '#6b7280',
    icon: '🏁',
  },
  Cancelled: {
    label: 'Cancelled',
    next: null,
    nextLabel: null,
    color: '#dc2626',
    bg: '#fef2f2',
    badge: '#dc2626',
    icon: '✕',
  },
};

const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const calcTotal = (items) =>
  items.reduce((sum, item) => sum + parseFloat(item.price_at_time_of_order) * item.quantity, 0);

const OrderCard = ({ order, onUpdateStatus, updating }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[order.status] || STATUS_META['Pending'];
  const total = calcTotal(order.items);

  return (
    <div className="sqp-card" style={{ borderTop: `4px solid ${meta.color}` }}>
      {/* Card Header */}
      <div className="sqp-card-header">
        <div className="sqp-token-block">
          <span className="sqp-token">{order.token}</span>
          <span className="sqp-order-id">#{order.id}</span>
        </div>
        <div className="sqp-time-block">
          <span className="sqp-time">{formatTime(order.created_at)}</span>
          <span className="sqp-date">{formatDate(order.created_at)}</span>
        </div>
      </div>

      {/* Customer */}
      <div className="sqp-customer">
        <span className="sqp-customer-icon">👤</span>
        <span>{order.customer_name}</span>
      </div>

      {/* Items summary / expanded */}
      <div className="sqp-items">
        {order.items.slice(0, expanded ? order.items.length : 2).map((item) => (
          <div key={item.id} className="sqp-item-row">
            <span className="sqp-item-qty">×{item.quantity}</span>
            <span className="sqp-item-name">{item.menu_item_name}</span>
            <span className="sqp-item-price">
              ₹{(parseFloat(item.price_at_time_of_order) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        {order.items.length > 2 && (
          <button className="sqp-expand-btn" onClick={() => setExpanded((e) => !e)}>
            {expanded ? '▲ Show less' : `▼ +${order.items.length - 2} more`}
          </button>
        )}
      </div>

      {/* Total */}
      <div className="sqp-total">
        <span>Total</span>
        <span className="sqp-total-amount">₹{total.toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="sqp-actions">
        {meta.next && (
          <button
            className="sqp-btn sqp-btn-next"
            style={{ background: STATUS_META[meta.next]?.color || meta.color }}
            onClick={() => onUpdateStatus(order.id, meta.next)}
            disabled={updating === order.id}
          >
            {updating === order.id ? '⏳ Updating…' : meta.nextLabel}
          </button>
        )}
        {order.status !== 'Cancelled' && order.status !== 'Served' && (
          <button
            className="sqp-btn sqp-btn-cancel"
            onClick={() => onUpdateStatus(order.id, 'Cancelled')}
            disabled={updating === order.id}
          >
            ✕ Cancel
          </button>
        )}
      </div>
    </div>
  );
};

const StaffQueuePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // order id being updated
  const [lastRefresh, setLastRefresh] = useState(null);
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'all'

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await api.get('/auth/orders/');
      setOrders(res.data);
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to load orders. Make sure you are logged in as staff.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await api.patch(`/auth/orders/${orderId}/status/`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? res.data : o))
      );
    } catch (err) {
      alert('Could not update order status. Please try again.');
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  // Derived counts
  const liveStatuses = ['Pending', 'In Progress', 'Ready'];
  const liveOrders = orders.filter((o) => liveStatuses.includes(o.status));
  const allOrders = orders;

  const displayOrders = activeTab === 'live' ? liveOrders : allOrders;

  // Count per status
  const counts = {};
  STATUS_PIPELINE.forEach((s) => {
    counts[s] = orders.filter((o) => o.status === s).length;
  });

  return (
    <div className="sqp-page">
      {/* ----- Header ----- */}
      <header className="sqp-header">
        <div className="sqp-header-left">
          <h1 className="sqp-title">🍽️ Canteen Order Dashboard</h1>
          <p className="sqp-subtitle">Manage and track orders in real-time</p>
        </div>
        <div className="sqp-header-right">
          {lastRefresh && (
            <span className="sqp-refresh-info">
              Last updated: {formatTime(lastRefresh.toISOString())}
            </span>
          )}
          <button className="sqp-refresh-btn" onClick={() => fetchOrders()} disabled={loading}>
            {loading ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </header>

      {/* ----- Status Bar ----- */}
      <div className="sqp-status-bar">
        {STATUS_PIPELINE.map((s) => {
          const meta = STATUS_META[s];
          return (
            <div key={s} className="sqp-status-pill" style={{ borderColor: meta.color }}>
              <span className="sqp-status-pill-icon">{meta.icon}</span>
              <div>
                <div className="sqp-status-pill-label">{meta.label}</div>
                <div className="sqp-status-pill-count" style={{ color: meta.color }}>
                  {counts[s] || 0} orders
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ----- Tabs ----- */}
      <div className="sqp-tabs">
        <button
          className={`sqp-tab ${activeTab === 'live' ? 'sqp-tab-active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          🔴 Live Orders ({liveOrders.length})
        </button>
        <button
          className={`sqp-tab ${activeTab === 'all' ? 'sqp-tab-active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📋 All Orders ({allOrders.length})
        </button>
      </div>

      {/* ----- Main Content ----- */}
      {error && (
        <div className="sqp-error">
          <span>⚠️ {error}</span>
          <button onClick={() => fetchOrders()}>Retry</button>
        </div>
      )}

      {loading && !error && (
        <div className="sqp-loading">
          <div className="sqp-spinner" />
          <p>Loading orders…</p>
        </div>
      )}

      {!loading && !error && (
        <div className="sqp-kanban">
          {(activeTab === 'live' ? liveStatuses : [...STATUS_PIPELINE, 'Cancelled']).map((status) => {
            const colOrders = displayOrders.filter((o) => o.status === status);
            const meta = STATUS_META[status];
            return (
              <div key={status} className="sqp-column">
                {/* Column Header */}
                <div className="sqp-col-header" style={{ background: meta.color }}>
                  <span>{meta.icon} {meta.label}</span>
                  <span className="sqp-col-badge">{colOrders.length}</span>
                </div>

                {/* Cards */}
                <div className="sqp-col-body">
                  {colOrders.length === 0 ? (
                    <div className="sqp-empty-col">
                      <span>No orders</span>
                    </div>
                  ) : (
                    colOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onUpdateStatus={handleUpdateStatus}
                        updating={updating}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffQueuePage;
