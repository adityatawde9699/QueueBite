import api from './api';

// Fetch menu items
const getMenu = () => {
  return api.get('/auth/menu/');
};

// Fetch all orders for the live queue
const getQueue = () => {
  return api.get('/auth/orders/queue/');
};

// Place a new order
const placeOrder = ({ canteen_id, items }) => {
  // items should be an array of { menu_item_id: X, quantity: Y }
  return api.post('/auth/orders/place/', { canteen_id, items });
};

// Fetch a specific user's active order
const getMyOrder = () => {
  return api.get('/auth/orders/my-order/');
};

// Update an order's status (for staff)
const updateOrderStatus = (orderId, status) => {
  return api.patch(`/auth/orders/${orderId}/status/`, { status });
};

const queueService = {
  getMenu,
  getQueue,
  placeOrder,
  getMyOrder,
  updateOrderStatus,
};

export default queueService;
