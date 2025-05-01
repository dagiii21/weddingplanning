/**
 * API Service Layer
 * 
 * Configures axios instance with:
 * - Base settings
 * - Authentication headers
 * - Global error handling
 */

import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL, ENDPOINTS } from '@/config/api.config';

// Configure axios instance
const api = axios.create({
  baseURL: API_URL, // Uses base URL from config
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor
 * 
 * Automatically adds auth token to requests.
 * Runs before every API call.
 */
api.interceptors.request.use(
  (config) => {
    // Get token from storage (checks both localStorage and sessionStorage)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Handles global API errors.
 * Runs after every response.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear auth storage
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
      toast.error('Your session has expired. Please login again.');
    }
    
    // Forward all errors
    return Promise.reject(error);
  }
);

// ======================
// SERVICE METHODS
// ======================

/**
 * Authentication Service
 */
export const authService = {
  login: (credentials) => api.post(ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(ENDPOINTS.AUTH.REGISTER, userData),
  validateToken: () => api.get(ENDPOINTS.AUTH.VALIDATE_TOKEN)
};

/**
 * User Service
 */
export const userService = {
  getProfile: () => api.get(ENDPOINTS.USER.PROFILE),
  updateProfile: (data) => api.put(ENDPOINTS.USER.UPDATE, data)
};

/**
 * Vendor Service
 */
export const vendorService = {
  register: (data) => api.post(ENDPOINTS.VENDOR.REGISTER, data),
  getServices: () => api.get(ENDPOINTS.VENDOR.SERVICES)
};

export default api;