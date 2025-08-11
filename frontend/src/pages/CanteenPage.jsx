import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './CanteenPage.css';
// Mock data for demonstration
const mockMenuItems = [
  { id: 1, name: 'Samosa', price: 15, image: 'https://bing.com/th?id=OSK.10206e70a525128cad7cef13d2e254c4' },
  { id: 2, name: 'Vada Pav', price: 20, image: 'https://tse1.mm.bing.net/th/id/OIP.DNxwrECi6nlQ1iF4WjrkkAHaFj?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 3, name: 'Masala Dosa', price: 60, image: 'https://thf.bing.com/th/id/OIP.Q5vy3i2Sojv9sZE9SSsiOQHaE4?w=271&h=180&c=7&r=0&o=7&cb=thfc1&pid=1.7&rm=3' },
  { id: 4, name: 'Sandwich', price: 70, image: 'https://thf.bing.com/th/id/OIP.gYoYdZQhus3i-y_D5aoBlwHaE7?w=234&h=180&c=7&r=0&o=7&cb=thfc1&pid=1.7&rm=3' },
  { id: 5, name: 'Veg Biryani', price: 180, image: 'https://thf.bing.com/th/id/OIP.V0o4wDz9TVqg75CRCwbT9QHaFO?w=251&h=180&c=7&r=0&o=7&cb=thfc1&pid=1.7&rm=3' },
  { id: 6, name: 'Coffee', price: 125, image: 'https://thf.bing.com/th/id/OIP.Dbh6OaBMj-2FN4i0LRKA7gHaFj?w=251&h=188&c=7&r=0&o=7&cb=thfc1&pid=1.7&rm=3' },
];

const CanteenPage = () => {
  const [queue, setQueue] = useState([]);
  const [cart, setCart] = useState([]);
  const [yourToken, setYourToken] = useState(null);

  // Effect to connect to Socket.IO and listen for queue updates
  useEffect(() => {
    // Replace with your actual backend server URL
    const socket = io('http://localhost:8000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('queue_update', (updatedQueue) => {
      setQueue(updatedQueue);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
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

  const placeOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // This is where you would typically send the order to the backend via API
    console.log('Placing order:', cart);
    // For demonstration, we'll generate a random token
    const newToken = `T#${Math.floor(100 + Math.random() * 900)}`;
    setYourToken(newToken);
    alert(`Your order has been placed! Your token is: ${newToken}`);
    setCart([]); // Clear the cart after placing order
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
          <div className="menu-grid">
            {mockMenuItems.map((item) => (
              <div key={item.id} className="menu-item-card">
                <img src={item.image} alt={item.name} className="menu-item-image" />
                <div className="menu-item-details">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-price">₹{item.price.toFixed(2)}</p>
                </div>
                <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))}
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
