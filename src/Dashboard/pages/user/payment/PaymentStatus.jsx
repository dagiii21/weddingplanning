import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Alert,
  AlertTitle,
  Grid,
  Stack,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Dashboard as DashboardIcon,
  Explore as ExploreIcon,
  Refresh as RefreshIcon,
  ContactSupport as ContactSupportIcon,
} from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { clientService } from "../../../../services/api";
import { toast } from "react-toastify";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("LOADING"); // LOADING, SUCCESS, FAILED
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const tx_ref = searchParams.get("tx_ref");
  const paymentId = searchParams.get("payment_id");

  const verifyPaymentStatus = async () => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);

    try {
      if (!tx_ref || !paymentId) {
        setError("Missing payment information in the URL");
        setErrorDetails({
          message: "The URL is missing required parameters",
          tx_ref: tx_ref || "Missing",
          paymentId: paymentId || "Missing",
        });
        setLoading(false);
        return;
      }

      const response = await clientService.verifyPayment({
        tx_ref,
        paymentId,
      });

      setPaymentDetails(response.data);
      setStatus(response.data.status);
      setLoading(false);

      // Show toast based on payment status
      if (response.data.status === "COMPLETED") {
        toast.success("Payment completed successfully!");
      } else if (response.data.status === "FAILED") {
        toast.error("Payment failed. Please try again.");
      } else {
        toast.info("Payment is still processing.");
      }
    } catch (err) {
      console.error("Payment verification error:", err);

      const errorMessage =
        err.response?.data?.message || "Payment verification failed";
      const statusCode = err.response?.status;

      // Set detailed error information
      setErrorDetails({
        message: errorMessage,
        code: statusCode,
        tx_ref: tx_ref,
        paymentId: paymentId,
        response: err.response?.data || {},
        timestamp: new Date().toISOString(),
      });

      setError(`${errorMessage} (Code: ${statusCode || "Unknown"})`);
      setStatus("FAILED");
      setLoading(false);

      toast.error(
        "Failed to verify payment status. Please try again or contact support."
      );
    }
  };

  useEffect(() => {
    verifyPaymentStatus();

    // Poll for payment status updates every 5 seconds if still pending
    const intervalId = setInterval(async () => {
      if (status === "PENDING") {
        try {
          const response = await clientService.verifyPayment({
            tx_ref,
            paymentId,
          });

          setPaymentDetails(response.data);
          setStatus(response.data.status);

          if (response.data.status !== "PENDING") {
            clearInterval(intervalId);
            if (response.data.status === "COMPLETED") {
              toast.success("Payment completed successfully!");
            } else if (response.data.status === "FAILED") {
              toast.error("Payment failed. Please try again.");
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
          clearInterval(intervalId);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [tx_ref, paymentId, status]);

  const handleViewPayments = () => {
    navigate("/dashboard/payments");
  };

  const handleViewBookings = () => {
    navigate("/dashboard/my-bookings");
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  const handleBrowseServices = () => {
    navigate("/dashboard/services");
  };

  const handleRetryVerification = () => {
    verifyPaymentStatus();
  };

  const handleContactSupport = () => {
    navigate("/dashboard/support", {
      state: {
        subject: "Payment Verification Issue",
        details: errorDetails,
      },
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        p={3}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5">Verifying Payment Status...</Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Please wait while we confirm your payment
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Payment Verification Error</AlertTitle>
          {error}
        </Alert>
        <Typography variant="body1" paragraph>
          We encountered an error while verifying your payment. This does not
          necessarily mean your payment failed.
        </Typography>
        <Typography variant="body1" paragraph>
          If you've been charged, your payment may still be processing. You can
          try to verify again or check your payment history.
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={2} mt={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleRetryVerification}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReceiptIcon />}
            onClick={handleViewPayments}
          >
            Check Payment History
          </Button>
          <Button
            variant="outlined"
            startIcon={<DashboardIcon />}
            onClick={handleViewDashboard}
          >
            Return to Dashboard
          </Button>
        </Box>

        {errorDetails && (
          <Alert severity="info" sx={{ mt: 4 }}>
            <AlertTitle>Technical Details</AlertTitle>
            <Typography variant="body2" component="div">
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem" }}>
                {JSON.stringify(
                  {
                    tx_ref: errorDetails.tx_ref,
                    paymentId: errorDetails.paymentId,
                    timestamp: errorDetails.timestamp,
                  },
                  null,
                  2
                )}
              </pre>
            </Typography>
            <Box mt={2}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContactSupportIcon />}
                onClick={handleContactSupport}
              >
                Contact Support
              </Button>
            </Box>
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
        {status === "COMPLETED" ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" paragraph>
              Your payment has been processed successfully. The vendor has been
              notified.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontWeight: "medium", mt: 2 }}
            >
              Would you like to explore more services for your wedding?
            </Typography>
          </Box>
        ) : status === "PENDING" ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h4" gutterBottom>
              Payment Processing
            </Typography>
            <Typography variant="body1" paragraph>
              Your payment is being processed. This page will update
              automatically once complete.
            </Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <CancelIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Payment Failed
            </Typography>
            <Typography variant="body1" paragraph>
              We couldn't process your payment. Please try again or contact
              support if the issue persists.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontWeight: "medium", mt: 2 }}
            >
              You can return to your dashboard and try again later.
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {paymentDetails && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Transaction Reference:
                </Typography>
                <Typography variant="body1">{tx_ref}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Amount:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ETB {paymentDetails.amount?.toLocaleString() || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Status:
                </Typography>
                <Typography
                  variant="body1"
                  color={
                    status === "COMPLETED"
                      ? "success.main"
                      : status === "PENDING"
                      ? "warning.main"
                      : "error.main"
                  }
                  fontWeight="bold"
                >
                  {status}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Date:
                </Typography>
                <Typography variant="body1">
                  {paymentDetails.date
                    ? new Date(paymentDetails.date).toLocaleString()
                    : new Date().toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
          {status === "COMPLETED" ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ExploreIcon />}
                onClick={handleBrowseServices}
                sx={{ minWidth: "200px" }}
              >
                Browse More Services
              </Button>
              <Button
                variant="outlined"
                startIcon={<ReceiptIcon />}
                onClick={handleViewPayments}
                sx={{ minWidth: "200px" }}
              >
                View Payment History
              </Button>
              <Button
                variant="outlined"
                startIcon={<DashboardIcon />}
                onClick={handleViewDashboard}
                sx={{ minWidth: "200px" }}
              >
                Go to Dashboard
              </Button>
            </>
          ) : status === "FAILED" ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DashboardIcon />}
                onClick={handleViewDashboard}
                sx={{ minWidth: "200px" }}
              >
                Return to Dashboard
              </Button>
              <Button
                variant="outlined"
                startIcon={<ReceiptIcon />}
                onClick={handleViewPayments}
                sx={{ minWidth: "200px" }}
              >
                View Payment History
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleViewDashboard}
            >
              Back to Dashboard
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentStatus;
