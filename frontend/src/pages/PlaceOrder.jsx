import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import queueService from '../services/queueService';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMenu = async () => {
    try {
      const res = await queueService.getMenu();
      setMenuItems(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load menu.');
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
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

  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + amount;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!menuItems.length) {
      alert('Menu not loaded yet. Please try again later.');
      return;
    }

    const canteen_id = cart[0]?.canteen;
    if (!canteen_id) {
      alert('Invalid canteen selected.');
      return;
    }

    const orderPayload = {
      canteen_id,
      items: cart.map((item) => ({ menu_item_id: item.id, quantity: item.quantity })),
    };

    setLoading(true);
    try {
      await queueService.placeOrder(orderPayload);
      alert('Order successfully placed!');
      navigate('/order-queue');
    } catch (err) {
      console.error('Place order failed', err);
      alert(err.response?.data?.error || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const menuByCategory = menuItems.reduce((acc, item) => {
    const category = item.canteen || 'general';
    (acc[category] = acc[category] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="place-order-layout">
      <div className="menu-container">
        <h1>Place Your Order</h1>
        {error && <p className="error-text">{error}</p>}
        {menuItems.length === 0 ? (
          <p>Loading menu...</p>
        ) : (
          Object.entries(menuByCategory).map(([canteen, items]) => (
            <div key={canteen} className="category-section">
              <h2>{`Canteen ${canteen}`}</h2>
              <div className="menu-items-grid">
                {items.map((item) => (
                  <div key={item.id} className="food-card">
                    <h3>{item.name}</h3>
                    <p>₹{parseFloat(item.price).toFixed(2)}</p>
                    <p>{item.description}</p>
                    <button onClick={() => handleAddToCart(item)}>Add</button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary-container">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-summary-list">
              {cart.map((item) => (
                <li key={item.id}>
                  <span className="item-name">{item.name}</span>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <span className="item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>×</button>
                </li>
              ))}
            </ul>
            <div className="final-total">
              <strong>Total:</strong>
              <strong>₹{getTotalPrice()}</strong>
            </div>
            <button className="confirm-order-btn" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Placing order…' : 'Confirm & Place Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
