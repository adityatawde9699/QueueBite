import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './StaffQueuePage.css';

// Mock data for initial state
const mockInitialOrders = [
  { id: 101, token: 'T#501', status: 'Pending', items: ['Samosa x2', 'Coffee x1'] },
  { id: 102, token: 'T#502', status: 'Pending', items: ['Vada Pav x1'] },
  { id: 103, token: 'T#503', status: 'In Progress', items: ['Masala Dosa x1', 'Coffee x1'] },
  { id: 104, token: 'T#504', status: 'In Progress', items: ['Veg Biryani x2'] },
  { id: 105, token: 'T#505', status: 'Ready', items: ['Chole Bhature x1'] },
];

const StaffQueuePage = () => {
  const [orders, setOrders] = useState(mockInitialOrders);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Replace with your actual backend server URL
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Staff connected to WebSocket server');
    });
    
    // You might listen for new orders from the server
    newSocket.on('new_order', (newOrder) => {
        setOrders(prevOrders => [...prevOrders, newOrder]);
    });

    return () => newSocket.disconnect();
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    // Emit the update to the server
    if (socket) {
      socket.emit('update_order_status', { orderId, status: newStatus });
    }
  };
  
  const getColumnOrders = (status) => {
      return orders.filter(order => order.status === status);
  }

  return (
    <div className="staff-queue-page">
      <header className="page-header">
        <h1>Live Order Dashboard</h1>
        <p>Manage incoming orders in real-time.</p>
      </header>
      <div className="order-columns-container">
        {/* Pending Column */}
        <div className="order-column">
          <h2 className="column-title pending-title">Pending</h2>
          <div className="order-list">
            {getColumnOrders('Pending').map((order) => (
              <div key={order.id} className="order-card">
                <div className="card-header">
                  <span className="order-token">{order.token}</span>
                </div>
                <ul className="item-list">
                    {order.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <div className="card-actions">
                  <button 
                    className="action-btn progress-btn"
                    onClick={() => updateOrderStatus(order.id, 'In Progress')}
                  >
                    Start Cooking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="order-column">
          <h2 className="column-title progress-title">In Progress</h2>
          <div className="order-list">
            {getColumnOrders('In Progress').map((order) => (
              <div key={order.id} className="order-card">
                <div className="card-header">
                  <span className="order-token">{order.token}</span>
                </div>
                 <ul className="item-list">
                    {order.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <div className="card-actions">
                  <button 
                    className="action-btn ready-btn"
                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                  >
                    Mark as Ready
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ready Column */}
        <div className="order-column">
          <h2 className="column-title ready-title">Ready for Pickup</h2>
          <div className="order-list">
            {getColumnOrders('Ready').map((order) => (
              <div key={order.id} className="order-card">
                <div className="card-header">
                  <span className="order-token">{order.token}</span>
                </div>
                 <ul className="item-list">
                    {order.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <div className="card-actions">
                  <button 
                    className="action-btn served-btn"
                    onClick={() => updateOrderStatus(order.id, 'Served')}
                  >
                    Mark as Served
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffQueuePage;
