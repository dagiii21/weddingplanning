// Environment configuration
// Access environment variables with fallbacks for development

// API URLs
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://leul-2.onrender.com/api";
export const API_DOMAIN =
  import.meta.env.VITE_API_DOMAIN || "https://leul-2.onrender.com";
export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  "https://weddingplanning-1-joi4.onrender.com";

export default {
  API_BASE_URL,
  API_DOMAIN,
  FRONTEND_URL,
};
