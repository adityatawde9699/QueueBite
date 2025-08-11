import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './RegistrationPage.css';

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/auth/register/', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
      
      navigate('/login');

    } catch (err) {
      console.error('Registration failed:', err);
      if (err.response) {
        // The server responded with an error status code
        const errorData = err.response.data;
        const errorMessages = Object.values(errorData).flat().join(' ');
        setError(errorMessages || 'An unknown error occurred on the server.');
      } else if (err.request) {
        // The request was made but no response was received (network error)
        setError('Could not connect to the server. Please make sure it is running.');
      } else {
        // Something else happened while setting up the request
        setError('An unexpected error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};


const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, isLoading, error } = useRegister();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <div className="registration-page-background">
      <div className="registration-page-container">
        <div className="registration-card">
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
                  Create Your Account
                </h4>
              </div>

              <form onSubmit={handleSubmit}>
                <p className="form-prompt">Join the QueueBite community!</p>
                
                {error && <p className="error-message">{error}</p>}

                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
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
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>

                <div className="login-section">
                  <p>Already have an account?</p>
                  <button 
                    type="button" 
                    className="login-btn"
                    onClick={() => navigate('/login')}
                  >
                    Log In
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
                QueueBite is a smart queue management system designed to eliminate long waits and streamline your canteen experience. With our platform, you can order your meals in advance, choose your preferred pickup time, and enjoy a hassle-free dining experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
