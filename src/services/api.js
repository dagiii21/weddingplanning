/**
 * API Service Layer
 *
 * Configures axios instance with:
 * - Base settings
 * - Authentication headers
 * - Global error handling
 */

import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, ENDPOINTS } from "@/config/api.config";

// Configure axios instance
const api = axios.create({
  baseURL: API_URL, // Uses base URL from config
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

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
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
      toast.error("Your session has expired. Please login again.");
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
  validateToken: () => api.get(ENDPOINTS.AUTH.VALIDATE_TOKEN),
};

/**
 * User Service
 */
export const userService = {
  getProfile: () => api.get(ENDPOINTS.USER.PROFILE),
  updateProfile: (data) => api.put(ENDPOINTS.USER.UPDATE, data),
};

/**
 * Vendor Service
 */
export const vendorService = {
  register: (data) => api.post(ENDPOINTS.VENDOR.REGISTER, data),
  getServices: () => api.get(ENDPOINTS.VENDOR.SERVICES),
  getDashboardData: async () => {
    try {
      const response = await api.get(ENDPOINTS.VENDOR.DASHBOARD);
      return {
        ...response,
        data: response.data?.data || response.data || {},
      };
    } catch (error) {
      console.error("Error fetching vendor dashboard:", error);
      throw error;
    }
  },
  getConversations: () => api.get(ENDPOINTS.VENDOR.CONVERSATIONS),
  startConversation: (clientId) =>
    api.post(ENDPOINTS.VENDOR.CONVERSATIONS, { clientId }),
  getPayments: () => api.get(ENDPOINTS.VENDOR.PAYMENTS),
  getProfile: () => api.get(ENDPOINTS.VENDOR.ACCOUNT_PROFILE),
  updateAccount: (vendorId, data) => {
    const url = ENDPOINTS.VENDOR.ACCOUNT_UPDATE.replace(":id", vendorId);
    return api.patch(url, data);
  },
};

/**
 * Dashboard Service
 * Handles dashboard-specific API calls
 */
export const dashboardService = {
  getUserStats: () => api.get(ENDPOINTS.DASHBOARD.USER_STATS),
  getBookings: (params) => api.get(ENDPOINTS.DASHBOARD.BOOKINGS, { params }),
  getEvents: (params) => api.get(ENDPOINTS.DASHBOARD.EVENTS, { params }),
  getNotifications: () => api.get(ENDPOINTS.DASHBOARD.NOTIFICATIONS),
};

/**
 * Client Service
 * Handles client-specific API calls
 */
export const clientService = {
  /**
   * Fetches client dashboard data
   * Returns totalPaymentAmount, payments, and bookings information
   */
  getDashboardData: () => api.get(ENDPOINTS.CLIENT.DASHBOARD),

  /**
   * Fetches client bookings with pagination
   * @param {Object} params - Query parameters for pagination and filtering
   * @returns {Promise} - Promise with bookings data
   */
  getBookings: (params = {}) => api.get(ENDPOINTS.CLIENT.BOOKINGS, { params }),

  /**
   * Fetches client payments with pagination
   * @param {Object} params - Query parameters for pagination and filtering
   * @returns {Promise} - Promise with payments data
   */
  getPayments: (params = {}) => api.get(ENDPOINTS.CLIENT.PAYMENTS, { params }),

  /**
   * Updates user account information including password
   * @param {string} userId - The ID of the user to update
   * @param {Object} data - The user data to update
   * @returns {Promise} - Promise with updated user data
   */
  updateAccount: (userId, data) => {
    const url = ENDPOINTS.CLIENT.ACCOUNT_UPDATE.replace(":id", userId);
    return api.patch(url, data);
  },

  /**
   * Fetches the current user's profile information
   * @returns {Promise} - Promise with user profile data
   */
  getProfile: () => api.get(ENDPOINTS.CLIENT.PROFILE),

  /**
   * Fetches available services with pagination
   * @param {Object} params - Query parameters for pagination and filtering
   * @returns {Promise} - Promise with services data
   */
  getServices: (params = {}) => api.get(ENDPOINTS.CLIENT.SERVICES, { params }),

  /**
   * Creates a new booking for a service
   * @param {Object} bookingData - Data for the new booking (serviceId, eventDate, location, etc.)
   * @returns {Promise} - Promise with created booking data
   */
  createBooking: (bookingData) =>
    api.post(ENDPOINTS.CLIENT.CREATE_BOOKING, bookingData),

  /**
   * Initiates a payment transaction for a booking
   * @param {Object} paymentData - Data for the payment (amount, vendorId, bookingId)
   * @returns {Promise} - Promise with payment data including checkout URL
   */
  initiatePayment: (paymentData) =>
    api.post(ENDPOINTS.CLIENT.PAYMENT_INITIATE, paymentData),

  /**
   * Gets all conversations for the current client
   * @returns {Promise} - Promise with conversations data
   */
  getConversations: () => api.get(ENDPOINTS.CLIENT.CONVERSATIONS),

  /**
   * Starts a new conversation with a vendor
   * @param {Object} data - Contains vendorId to start conversation with
   * @returns {Promise} - Promise with created conversation data
   */
  startConversation: (data) =>
    api.post(ENDPOINTS.CLIENT.START_CONVERSATION, data),
};

export default api;
