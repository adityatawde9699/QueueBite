import React, { useState, useEffect } from 'react';
import queueService from '../services/queueService';
import './CanteenPage.css';

const CanteenPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [queue, setQueue] = useState([]);
  const [cart, setCart] = useState([]);
  const [yourToken, setYourToken] = useState(null);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    try {
      const res = await queueService.getMenu();
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to fetch menu items', err);
      setError('Could not load menu. Please refresh.');
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await queueService.getQueue();
      setQueue(res.data);
    } catch (err) {
      console.error('Failed to fetch queue', err);
      setError('Could not load live queue.');
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchQueue();

    const interval = setInterval(fetchQueue, 12000); // Poll every 12 seconds
    return () => clearInterval(interval);
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!menuItems.length) {
      alert('Menu data not available. Please refresh.');
      return;
    }

    // Validate canteen consistency and input format
    const uniqueCanteens = [...new Set(cart.map((c) => c.canteen))];
    if (uniqueCanteens.length > 1) {
      alert('Please place separate orders for each canteen.');
      return;
    }

    const canteen_id = uniqueCanteens[0];
    const items = cart.map((c) => ({ menu_item_id: c.id, quantity: c.quantity }));

    try {
      const res = await queueService.placeOrder({ canteen_id, items });
      setYourToken(res.data.token);
      setCart([]);
      alert(`Order placed successfully! Your token is ${res.data.token}`);
      fetchQueue();
    } catch (err) {
      console.error('Error placing order:', err);
      const serverError =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        'Failed to place order.';
      alert(serverError);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };


  return (
    <div className="canteen-page">
      <main className="canteen-content">
        {/* Menu Section */}
        <section className="menu-section">
          <h1 className="section-title">Today's Menu</h1>
          {error && <p className="error-text">{error}</p>}
          <div className="menu-grid">
            {menuItems.length === 0 ? (
              <p>Loading menu...</p>
            ) : (
              menuItems.map((item) => (
                <div key={item.id} className="menu-item-card">
                  {item.image && <img src={item.image} alt={item.name} className="menu-item-image" />}
                  <div className="menu-item-details">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <p className="menu-item-price">₹{parseFloat(item.price).toFixed(2)}</p>
                    <p className="menu-item-desc">{item.description}</p>
                  </div>
                  <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Order & Queue Section */}
        <aside className="sidebar">
          {/* Your Order Cart */}
          <div className="cart-section">
            <h2 className="sidebar-title">Your Order</h2>
            {cart.length === 0 ? (
              <p className="empty-cart-message">Your cart is empty. Add items from the menu!</p>
            ) : (
              <>
                <ul className="cart-items-list">
                  {cart.map((item) => (
                    <li key={item.id} className="cart-item">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="cart-total">
                  <strong>Total:</strong>
                  <strong>₹{getTotalPrice()}</strong>
                </div>
                <button className="place-order-btn" onClick={placeOrder}>
                  Place Order
                </button>
              </>
            )}
          </div>

          {/* Live Queue */}
          <div className="queue-section">
            <h2 className="sidebar-title">Live Queue</h2>
            {yourToken && (
              <div className="your-token-display">
                Your Token: <strong>{yourToken}</strong>
              </div>
            )}
            <div className="queue-status-grid">
                <div className="queue-column preparing">
                    <h4>Preparing</h4>
                    <ul>
                        {queue.filter(o => o.status === 'In Progress').map(order => <li key={order.id}>{order.token}</li>)}
                    </ul>
                </div>
                <div className="queue-column ready">
                    <h4>Ready for Pickup</h4>
                    <ul>
                        {queue.filter(o => o.status === 'Ready').map(order => <li key={order.id}>{order.token}</li>)}
                    </ul>
                </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CanteenPage;
