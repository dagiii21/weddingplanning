import { useState, useEffect, useCallback } from "react";
import { vendorService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Custom hook for fetching and managing vendor dashboard data
 *
 * @returns {Object} Dashboard data and loading state
 */
const useVendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorService.getDashboardOverview();

      if (response && response.success) {
        setDashboardData(response.data);

        // Check if vendor is not approved and show message
        if (response.data.status && response.data.status !== "APPROVED") {
          toast.info(
            response.data.message || "Your account is pending approval",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        }
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      setError(
        error.message || "An error occurred while fetching dashboard data"
      );

      // Check if the error is related to unauthorized access or vendor status
      if (error.response && error.response.status === 403) {
        // Navigate to login if unauthorized
        if (
          error.response.data &&
          error.response.data.status === "PENDING_APPROVAL"
        ) {
          toast.warning("Your vendor account is pending approval.");
        } else if (
          error.response.data &&
          error.response.data.status === "SUSPENDED"
        ) {
          toast.error(
            "Your vendor account has been suspended. Please contact support."
          );
        }
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { dashboardData, loading, error, refetch: fetchDashboardData };
};

export default useVendorDashboard;
