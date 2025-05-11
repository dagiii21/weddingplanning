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
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
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

  const tx_ref = searchParams.get("tx_ref");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (!tx_ref || !paymentId) {
      setError("Invalid payment information");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
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
        setError(err.response?.data?.message || "Payment verification failed");
        setStatus("FAILED");
        setLoading(false);
        toast.error("Failed to verify payment status");
      }
    };

    verifyPayment();

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
    navigate("/dashboard/payment");
  };

  const handleViewBookings = () => {
    navigate("/dashboard/bookings");
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
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleViewPayments}
        >
          Back to Payments
        </Button>
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

        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleViewPayments}
          >
            Payment History
          </Button>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            onClick={handleViewBookings}
          >
            View Bookings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentStatus;
