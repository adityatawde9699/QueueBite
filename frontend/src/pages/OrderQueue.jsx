import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import QueueCard from '../components/QueueCard.jsx';
import Loader from '../components/Loader.jsx';
import './OrderQueue.css';

// Mock data for demonstration
const mockUserOrder = { id: 103, token: 'T#503', status: 'In Progress', items: ['Masala Dosa x1', 'Coffee x1'] };

const OrderQueue = () => {
  const [liveQueue, setLiveQueue] = useState([]);
  const [myOrder, setMyOrder] = useState(mockUserOrder);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching initial data with a longer delay
    setTimeout(() => {
        // In a real app, you'd fetch this from your backend
        setLiveQueue([
            { id: 103, token: 'T#503', status: 'In Progress', items: ['Masala Dosa x1', 'Coffee x1'] },
            { id: 104, token: 'T#504', status: 'In Progress', items: ['Veg Biryani x2'] },
            { id: 105, token: 'T#505', status: 'Ready', items: ['Chole Bhature x1'] },
        ]);
        setIsLoading(false);
    }, 3000); // Increased to 3 seconds

    const socket = io('http://localhost:8000');

    socket.on('queue_update', (updatedQueue) => {
      setLiveQueue(updatedQueue);
      // Check if the user's order status has changed
      const updatedUserOrder = updatedQueue.find(order => order.id === myOrder.id);
      if (updatedUserOrder) {
        setMyOrder(updatedUserOrder);
      }
    });

    return () => socket.disconnect();
  }, [myOrder.id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="order-queue-page">
      <div className="page-container">
        <section className="my-order-section">
          <h2>Your Order Status</h2>
          {myOrder ? (
            <QueueCard order={myOrder} />
          ) : (
            <p>You have no active orders.</p>
          )}
        </section>

        <section className="live-queue-feed">
          <h2>Live Canteen Queue</h2>
          <div className="queue-columns">
            <div className="queue-column-wrapper">
              <h3>In Progress</h3>
              <div className="queue-list">
                {liveQueue.filter(o => o.status === 'In Progress').map(order => (
                  <QueueCard key={order.id} order={order} />
                ))}
              </div>
            </div>
            <div className="queue-column-wrapper">
              <h3>Ready for Pickup</h3>
              <div className="queue-list">
                {liveQueue.filter(o => o.status === 'Ready').map(order => (
                  <QueueCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderQueue;
