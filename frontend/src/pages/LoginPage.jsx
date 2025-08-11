import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import './LoginPage.css';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/token/', { username, password });
      const { access, refresh } = response.data;
      setTokens(access, refresh);
      const userResponse = await api.get('/auth/user/');
      setUser(userResponse.data);
      if (userResponse.data.is_staff_member) {
        navigate('/staff/queue');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      if (err.response) {
        // The server responded with an error status code (e.g., 401, 500)
        if (err.response.status === 401) {
          setError('Invalid username or password.');
        } else {
          setError('An error occurred on the server. Please try again later.');
        }
      } else if (err.request) {
        // The request was made but no response was received (network error)
        setError('Could not connect to the server. Please make sure it is running.');
      } else {
        // Something else happened while setting up the request
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return { login, isLoading, error };
};


const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials.username, credentials.password);
  };

  return (
    <div className="login-page-background">
      <div className="login-page-container">
        <div className="login-card">
          {/* Left Column: The Form */}
          <div className="form-column">
            <div className="form-content">
              <div className="logo-container">
                <img
                  className="logo-image"
                  src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                  alt="logo"
                />
                <h4 className="logo-title">
                  We are The QueueBite Team
                </h4>
              </div>

              <form onSubmit={handleSubmit}>
                <p className="form-prompt">Please login to your account</p>
                
                {error && <p className="error-message">{error}</p>}

                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Log in'}
                  </button>
                  <a href="#!" className="forgot-password-link">Forgot password?</a>
                </div>

                <div className="register-section">
                  <p>Don't have an account?</p>
                  <button 
                    type="button" 
                    className="register-btn" 
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: The Info Panel */}
          <div className="info-column">
            <div className="info-content">
              <h3 className="info-title">
                Welcome to QueueBite!
              </h3>
              <h4 className='info-subtitle'>
                Order ahead, skip the line, and enjoy your meal!
              </h4>
              <p className="info-text">
                QueueBite is a smart queue management system designed to eliminate long waits and streamline your canteen experience. With our platform, you can order your meals in advance, choose your preferred pickup time, and enjoy a hassle-free dining experience. Whether you're a student or a staff member, QueueBite is here to make your mealtime efficient and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
