import { useState, useEffect } from "react";
import { clientService } from "../services/api";
import { toast } from "react-toastify";

/**
 * Custom hook for fetching and managing client dashboard data
 *
 * @returns {Object} Dashboard data and loading state
 */
const useClientDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPaymentAmount: 0,
    payments: [],
    bookings: {
      pending: { count: 0, data: [] },
      confirmed: { count: 0, data: [] },
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await clientService.getDashboardData();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
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

export default useClientDashboard;
