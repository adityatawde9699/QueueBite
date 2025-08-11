import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceOrder.css';

// Mock data, same as CanteenPage
const mockMenuItems = [
  { id: 1, name: 'Samosa', price: 15, category: 'Snacks' },
  { id: 2, name: 'Vada Pav', price: 20, category: 'Snacks' },
  { id: 3, name: 'Masala Dosa', price: 50, category: 'Main Course' },
  { id: 4, name: 'Chole Bhature', price: 70, category: 'Main Course' },
  { id: 5, name: 'Veg Biryani', price: 80, category: 'Main Course' },
  { id: 6, name: 'Coffee', price: 25, category: 'Beverages' },
  { id: 7, name: 'Tea', price: 15, category: 'Beverages' },
];

const PlaceOrder = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

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
      setCart(cart.filter(item => item.id !== itemId));
  }

  const updateQuantity = (itemId, amount) => {
      setCart(cart.map(item => {
          if (item.id === itemId) {
              const newQuantity = item.quantity + amount;
              return newQuantity > 0 ? {...item, quantity: newQuantity} : null;
          }
          return item;
      }).filter(Boolean)); // filter(Boolean) removes null items
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // In a real app, you would post the cart to your backend API
    console.log('Order placed:', cart);
    alert('Order successfully placed! You will be redirected to the queue.');
    navigate('/order-queue'); // Redirect to the queue page
  };
  
  const menuByCategory = mockMenuItems.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
  }, {});

  return (
    <div className="place-order-layout">
      <div className="menu-container">
        <h1>Place Your Order</h1>
        {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} className="category-section">
                <h2>{category}</h2>
                <div className="menu-items-grid">
                    {items.map(item => (
                        <div key={item.id} className="food-card">
                            <h3>{item.name}</h3>
                            <p>₹{item.price.toFixed(2)}</p>
                            <button onClick={() => handleAddToCart(item)}>Add</button>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      <div className="cart-summary-container">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-summary-list">
              {cart.map(item => (
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
            <button className="confirm-order-btn" onClick={handlePlaceOrder}>
              Confirm & Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
