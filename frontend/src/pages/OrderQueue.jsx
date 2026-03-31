import React, { useState, useEffect } from 'react';
import QueueCard from '../components/QueueCard.jsx';
import Loader from '../components/Loader.jsx';
import queueService from '../services/queueService';
import './OrderQueue.css';

const OrderQueue = () => {
  const [liveQueue, setLiveQueue] = useState([]);
  const [myOrder, setMyOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [queueResp, myOrderResp] = await Promise.all([queueService.getQueue(), queueService.getMyOrder()]);
      setLiveQueue(queueResp.data);
      setMyOrder(myOrderResp.data);
    } catch (err) {
      console.error('Failed to fetch order data', err);
      setError('Unable to fetch queue data right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 13000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="order-queue-page">
      <div className="page-container">
        <section className="my-order-section">
          <h2>Your Order Status</h2>
          {error && <p className="error-text">{error}</p>}
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
                {liveQueue.filter((o) => o.status === 'In Progress').map((order) => (
                  <QueueCard key={order.id} order={order} />
                ))}
              </div>
            </div>
            <div className="queue-column-wrapper">
              <h3>Ready for Pickup</h3>
              <div className="queue-list">
                {liveQueue.filter((o) => o.status === 'Ready').map((order) => (
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
