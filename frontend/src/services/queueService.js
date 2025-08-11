import api from './api';

// Fetch all orders for the live queue
const getQueue = () => {
  return api.get('/orders/queue/');
};

// Place a new order
const placeOrder = (orderData) => {
  // orderData should be an array of { menu_item_id: X, quantity: Y }
  return api.post('/orders/place/', { items: orderData });
};

// Fetch a specific user's active order
const getMyOrder = () => {
  return api.get('/orders/my-order/');
};

// Update an order's status (for staff)
const updateOrderStatus = (orderId, status) => {
  return api.patch(`/orders/update-status/${orderId}/`, { status });
};

const queueService = {
  getQueue,
  placeOrder,
  getMyOrder,
  updateOrderStatus,
};

export default queueService;
