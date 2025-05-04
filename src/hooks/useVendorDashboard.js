import { useState, useEffect } from "react";
import { vendorService } from "../services/api";
import { toast } from "react-toastify";

/**
 * Custom hook for fetching and managing vendor dashboard data
 *
 * @returns {Object} Dashboard data and loading state
 */
const useVendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    vendorId: "",
    businessName: "",
    serviceType: "",
    rating: 0,
    totalBookings: 0,
    pendingBookings: { count: 0, data: [] },
    confirmedBookings: { count: 0, data: [] },
    completedBookings: { count: 0, data: [] },
    allBookings: { count: 0, data: [] },
    revenue: { total: 0, currency: "ETB", breakdown: [] },
    chatsToday: 0,
    servicesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await vendorService.getDashboardData();

      console.log("API Response:", response);

      // Safely access response data, using empty object as fallback
      const apiData = response?.data || {};

      console.log("API Data:", apiData);

      // Ensure proper structure with default values for nested properties
      const data = {
        ...dashboardData, // Start with default values
        ...apiData, // Overwrite with API response
        // Ensure nested objects exist with defaults
        pendingBookings: {
          count: apiData.pendingBookings?.count || 0,
          data: apiData.pendingBookings?.data || [],
        },
        confirmedBookings: {
          count: apiData.confirmedBookings?.count || 0,
          data: apiData.confirmedBookings?.data || [],
        },
        completedBookings: {
          count: apiData.completedBookings?.count || 0,
          data: apiData.completedBookings?.data || [],
        },
        allBookings: {
          count: apiData.allBookings?.count || 0,
          data: apiData.allBookings?.data || [],
        },
        revenue: {
          total: apiData.revenue?.total || 0,
          currency: apiData.revenue?.currency || "ETB",
          breakdown: apiData.revenue?.breakdown || [],
        },
      };

      console.log("Processed Data:", data);

      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching vendor dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
      toast.error("Could not load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Return values and methods to use in components
  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

export default useVendorDashboard;
