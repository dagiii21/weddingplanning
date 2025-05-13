import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import useVendorBookings from "../../../../hooks/useVendorBookings";

// Service Tier Chip component
const TierChip = ({ tier }) => {
  // Get appropriate color for the tier
  const getTierColor = (tier) => {
    if (!tier) return "#4caf50";

    switch (tier) {
      case "PLATINUM":
        return "#e5e4e2"; // Platinum color
      case "GOLD":
        return "#ffd700"; // Gold color
      case "SILVER":
        return "#c0c0c0"; // Silver color
      case "BRONZE":
        return "#cd7f32"; // Bronze color
      default:
        return "#4caf50"; // Green for others
    }
  };

  // Get appropriate text color for the tier
  const getTextColor = (tier) => {
    if (!tier) return "#fff";
    return tier === "PLATINUM" || tier === "SILVER" ? "#000" : "#fff";
  };

  // Format tier text for display
  const formatTier = (text) => {
    if (!text) return "Standard";
    return text.charAt(0) + text.slice(1).toLowerCase();
  };

  const color = getTierColor(tier);
  const textColor = getTextColor(tier);

  return (
    <Chip
      label={formatTier(tier)}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
      size="small"
    />
  );
};

// Format date to a more readable format
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

// Get appropriate status chip with color
const getStatusChip = (status) => {
  let color;
  let icon;

  switch (status) {
    case "PENDING":
      color = "warning";
      break;
    case "CONFIRMED":
      color = "info";
      break;
    case "COMPLETED":
      color = "success";
      break;
    case "CANCELLED":
      color = "error";
      break;
    default:
      color = "default";
  }

  return (
    <Chip
      label={status.charAt(0) + status.slice(1).toLowerCase()}
      color={color}
      size="small"
    />
  );
};

const BookingList = () => {
  const navigate = useNavigate();
  const {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    confirmBooking,
    cancelBooking,
    completeBooking,
  } = useVendorBookings();

  // Make sure bookings is always an array even if it's null or undefined
  const safeBookings = bookings || [];

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");

  // Load bookings on component mount and when filters change
  useEffect(() => {
    const params = {
      page,
      limit,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    fetchBookings(params);
  }, [fetchBookings, statusFilter, page, limit]);

  const handleViewBooking = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await confirmBooking(bookingId);
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  const handleOpenCancelDialog = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setCancellationReason("");
    setSelectedBooking(null);
  };

  const handleSubmitCancellation = async () => {
    if (!selectedBooking || !cancellationReason.trim()) return;

    try {
      await cancelBooking(selectedBooking.id, cancellationReason);
      handleCloseCancelDialog();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await completeBooking(bookingId);
    } catch (error) {
      console.error("Error completing booking:", error);
    }
  };

  const handleChangeStatusFilter = (event, newValue) => {
    setStatusFilter(newValue);
    setPage(1); // Reset to first page when filter changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (loading && safeBookings.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => fetchBookings({ page, limit, status: statusFilter })}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
        Manage Bookings
      </Typography>

      {/* Status Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={statusFilter}
          onChange={handleChangeStatusFilter}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="all" label="All" />
          <Tab value="PENDING" label="Pending" />
          <Tab value="CONFIRMED" label="Confirmed" />
          <Tab value="COMPLETED" label="Completed" />
          <Tab value="CANCELLED" label="Cancelled" />
        </Tabs>
      </Paper>

      {/* Bookings Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeBookings.length > 0 ? (
              safeBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {booking.service?.name || "Unnamed Service"}
                  </TableCell>
                  <TableCell>
                    <TierChip
                      tier={booking.tier?.tier || booking.selectedTier}
                    />
                  </TableCell>
                  <TableCell>
                    {booking.client?.user
                      ? `${booking.client.user.firstName || ""} ${
                          booking.client.user.lastName || ""
                        }`.trim()
                      : "Unknown Client"}
                  </TableCell>
                  <TableCell>{formatDate(booking.eventDate)}</TableCell>
                  <TableCell>
                    ETB{" "}
                    {(
                      booking.tier?.price ||
                      booking.service?.basePrice ||
                      0
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(booking.status || "PENDING")}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewBooking(booking.id)}
                        title="View Details"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>

                      {booking.status === "PENDING" && (
                        <Tooltip title="Confirm Booking">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleConfirmBooking(booking.id)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {(booking.status === "PENDING" ||
                        booking.status === "CONFIRMED") && (
                        <Tooltip title="Cancel Booking">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenCancelDialog(booking)}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {booking.status === "CONFIRMED" && (
                        <Tooltip title="Mark as Completed">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleCompleteBooking(booking.id)}
                          >
                            <DoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="textSecondary" p={3}>
                    No bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 2, alignItems: "center" }}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Stack>
      )}

      {/* Cancellation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Please provide a reason for cancellation:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Cancellation Reason"
            fullWidth
            multiline
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitCancellation}
            color="error"
            disabled={!cancellationReason.trim()}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingList;
