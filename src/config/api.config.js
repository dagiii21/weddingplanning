/**
 * API Configuration File
 *
 * Centralizes all API endpoint paths and base URL configuration.
 * Uses environment variables for deployment flexibility.
 */

// Base API URL - Configured via environment variable with fallback
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Endpoint Definitions
 *
 * Organized by domain (AUTH, USER, etc.) for better maintainability.
 * All paths are relative to API_URL.
 */
export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VALIDATE_TOKEN: "/auth/validate",
  },

  // User management endpoints
  USER: {
    PROFILE: "/users/profile",
    UPDATE: "/users/profile",
  },

  // Vendor-specific endpoints
  VENDOR: {
    REGISTER: "/vendors/register",
    SERVICES: "/vendor/services",
    DASHBOARD: "/vendor/dashboard/overview",
    BOOKINGS: "/vendor/bookings",
    CONVERSATIONS: "/vendor/conversations",
    PAYMENTS: "/vendor/payment",
    ACCOUNT_PROFILE: "/vendor/account/profile",
    ACCOUNT_UPDATE: "/vendor/account/:id",
  },

  // Dashboard endpoints
  DASHBOARD: {
    USER_STATS: "/dashboard/stats",
    BOOKINGS: "/dashboard/bookings",
    EVENTS: "/dashboard/events",
    NOTIFICATIONS: "/dashboard/notifications",
  },

  // Client specific endpoints
  CLIENT: {
    DASHBOARD: "/client/dashboard",
    BOOKINGS: "/client/bookings",
    PAYMENTS: "/client/payment",
    PAYMENT_INITIATE: "/client/payment/initiate",
    ACCOUNT_UPDATE: "/client/account/:id",
    PROFILE: "/client/account/profile",
    SERVICES: "/client/services",
    CREATE_BOOKING: "/client/bookings",
    CONVERSATIONS: "/client/conversations",
    START_CONVERSATION: "/client/conversation",
  },
};
