// Environment configuration
// Access environment variables with fallbacks for development

// API URLs
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const API_DOMAIN =
  import.meta.env.VITE_API_DOMAIN || "http://localhost:5000";
export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  "https://weddingplanning-1-joi4.onrender.com";

export default {
  API_BASE_URL,
  API_DOMAIN,
  FRONTEND_URL,
};
