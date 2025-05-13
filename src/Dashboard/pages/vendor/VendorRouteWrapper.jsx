import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { vendorService } from "../../../services/api";
import { toast } from "react-toastify";
import { CircularProgress, Box } from "@mui/material";
import PendingApprovalPage from "./PendingApprovalPage";

/**
 * Wrapper component for vendor routes that checks approval status
 * Shows the pending approval page for unapproved vendors on any vendor route
 */
const VendorRouteWrapper = ({ children }) => {
  const [vendorStatus, setVendorStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Check if current route is a vendor route that should be protected
  const isVendorRoute = useCallback(() => {
    const path = location.pathname;
    return (
      path.includes("/bookings") ||
      path.includes("/services") ||
      path.includes("/Mangeservices") ||
      path.includes("/payments") ||
      path.includes("/settings")
    );
  }, [location.pathname]);

  // Fetch vendor status when component mounts
  const checkVendorStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await vendorService.getDashboardOverview();

      if (response && response.success && response.data) {
        setVendorStatus(response.data.status);

        // Show toast message for pending vendors if on a protected route
        if (response.data.status !== "APPROVED" && isVendorRoute()) {
          toast.warning(
            response.data.message ||
              "Your account is pending approval. Some features are restricted.",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        }
      }
    } catch (error) {
      console.error("Error checking vendor status:", error);
      setError("Failed to verify account status");

      // Check if the error response contains status information
      if (error.response?.data?.status) {
        setVendorStatus(error.response.data.status);
      }
    } finally {
      setLoading(false);
    }
  }, [isVendorRoute]);

  useEffect(() => {
    checkVendorStatus();
  }, [checkVendorStatus]);

  // Show loading spinner while checking status
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show pending approval page if vendor is not approved and trying to access protected routes
  if (vendorStatus && vendorStatus !== "APPROVED" && isVendorRoute()) {
    return <PendingApprovalPage />;
  }

  // Show the actual route component if vendor is approved or accessing non-protected routes
  return children;
};

export default VendorRouteWrapper;
