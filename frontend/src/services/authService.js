import api from './api';

const register = (userData) => {
  return api.post('/auth/register/', userData);
};

const login = (credentials) => {
  return api.post('/token/', credentials);
};

const getUser = () => {
    return api.get('/auth/user/');
};

const authService = {
  register,
  login,
  getUser,
};

export default authService;
