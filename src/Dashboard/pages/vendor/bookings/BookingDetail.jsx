import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  EventNote as EventNoteIcon,
  ArrowBack as ArrowBackIcon,
  ChatBubble as ChatIcon,
  Send as SendIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import useVendorBookings from "../../../../hooks/useVendorBookings";
import useVendorChat from "../../../../hooks/useVendorChat";
import { toast } from "react-toastify";
import { format } from "date-fns";

// Chat dialog component
const ChatDialog = ({ open, onClose, clientId, clientName, clientAvatar }) => {
  const {
    currentConversation,
    messages,
    loading,
    error,
    startConversation,
    selectConversation,
    sendMessage,
  } = useVendorChat();
  const [newMessage, setNewMessage] = useState("");
  const [initializing, setInitializing] = useState(false);
  const messagesEndRef = React.useRef(null);

  // Initialize conversation with client
  useEffect(() => {
    if (open && clientId && !initializing) {
      setInitializing(true);
      startConversation(clientId)
        .then(() => setInitializing(false))
        .catch((err) => {
          console.error("Error starting conversation:", err);
          toast.error("Could not start conversation with client");
          setInitializing(false);
        });
    }

    // Cleanup when dialog closes
    return () => {
      if (!open) {
        selectConversation(null);
      }
    };
  }, [open, clientId, startConversation, selectConversation, initializing]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    sendMessage(newMessage.trim());
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), "h:mm a");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { height: "70vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Avatar sx={{ mr: 2 }} src={clientAvatar}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h6">Chat with {clientName}</Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {loading || initializing ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography color="error" variant="subtitle1" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => startConversation(clientId)}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
            {messages.length === 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <ChatIcon sx={{ fontSize: 60, color: "action.disabled" }} />
                <Typography variant="body1" color="text.secondary" mt={2}>
                  No messages yet. Start the conversation!
                </Typography>
              </Box>
            ) : (
              <List>
                {messages.map((message) => {
                  const isVendorMessage =
                    message.senderId === currentConversation?.userId;

                  return (
                    <ListItem
                      key={message.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isVendorMessage ? "flex-end" : "flex-start",
                        p: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isVendorMessage
                            ? "row-reverse"
                            : "row",
                          alignItems: "flex-start",
                          maxWidth: "80%",
                        }}
                      >
                        {!isVendorMessage && (
                          <Avatar
                            sx={{ mr: 1, width: 32, height: 32 }}
                            src={clientAvatar}
                          >
                            <PersonIcon />
                          </Avatar>
                        )}

                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: isVendorMessage
                              ? "primary.main"
                              : "grey.200",
                            color: isVendorMessage ? "white" : "text.primary",
                          }}
                        >
                          <Typography variant="body1">
                            {message.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: "right",
                              mt: 0.5,
                              opacity: 0.8,
                            }}
                          >
                            {formatTime(message.createdAt)}
                          </Typography>
                        </Paper>
                      </Box>
                    </ListItem>
                  );
                })}
                <div ref={messagesEndRef} />
              </List>
            )}
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            display: "flex",
            borderTop: 1,
            borderColor: "divider",
            pt: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading || initializing || !currentConversation}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            type="submit"
            disabled={
              !newMessage.trim() ||
              loading ||
              initializing ||
              !currentConversation
            }
          >
            Send
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const {
    currentBooking,
    loading,
    error,
    fetchBookingById,
    confirmBooking,
    cancelBooking,
    completeBooking,
  } = useVendorBookings();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [chatDialogOpen, setChatDialogOpen] = useState(false);

  // Fetch booking details on component mount
  useEffect(() => {
    fetchBookingById(bookingId);
  }, [fetchBookingById, bookingId]);

  const handleConfirm = async () => {
    try {
      await confirmBooking(bookingId);
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancellationReason.trim()) return;

    try {
      await cancelBooking(bookingId, cancellationReason);
      setCancelDialogOpen(false);
      setCancellationReason("");
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  };

  const handleComplete = async () => {
    try {
      await completeBooking(bookingId);
    } catch (err) {
      console.error("Error completing booking:", err);
    }
  };

  const handleStartChat = () => {
    if (!currentBooking?.client?.id) return;
    setChatDialogOpen(true);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "PENDING":
        return <Chip label="Pending" color="warning" />;
      case "CONFIRMED":
        return <Chip label="Confirmed" color="primary" />;
      case "COMPLETED":
        return <Chip label="Completed" color="success" />;
      case "CANCELLED":
        return <Chip label="Cancelled" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `ETB ${amount?.toLocaleString() || 0}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => fetchBookingById(bookingId)}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (!currentBooking) {
    return (
      <Box p={3}>
        <Typography variant="h6">Booking not found</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/bookings")}
          sx={{ mt: 2 }}
        >
          Back to Bookings
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/bookings")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          Booking Details
        </Typography>
        <Box ml="auto" display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ChatIcon />}
            onClick={handleStartChat}
          >
            Chat with Client
          </Button>
          {getStatusChip(currentBooking.status)}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Service Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader title="Service Information" />
            <Divider />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {currentBooking.service.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {currentBooking.service.description}
              </Typography>
              <Box mt={2}>
                <Chip
                  label={`Category: ${currentBooking.service.category}`}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={`Price: ETB ${currentBooking.service.price.toLocaleString()}`}
                  color="primary"
                  size="small"
                  sx={{ mb: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Client Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader
              avatar={
                <Avatar
                  src={currentBooking.client.user.avatar}
                  alt={`${currentBooking.client.user.firstName} ${currentBooking.client.user.lastName}`}
                />
              }
              title="Client Information"
              action={
                <Button
                  startIcon={<ChatIcon />}
                  size="small"
                  onClick={handleStartChat}
                >
                  Chat
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${currentBooking.client.user.firstName} ${currentBooking.client.user.lastName}`}
                    secondary="Client Name"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={currentBooking.client.user.email}
                    secondary="Email"
                  />
                </ListItem>
                {currentBooking.client.user.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={currentBooking.client.user.phone}
                      secondary="Phone"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Details */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardHeader title="Booking Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1}
                      color="primary.main"
                    >
                      <EventIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Event Date</Typography>
                    </Box>
                    <Typography variant="body1">
                      {formatDate(currentBooking.eventDate)}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1}
                      color="primary.main"
                    >
                      <MoneyIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Payment Status
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {currentBooking.payments &&
                      currentBooking.payments.length > 0
                        ? currentBooking.payments[0].status
                        : "No Payment"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1}
                      color="primary.main"
                    >
                      <LocationIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Location</Typography>
                    </Box>
                    <Typography variant="body1">
                      {currentBooking.location || "Not specified"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1}
                      color="primary.main"
                    >
                      <EventNoteIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Booking Date</Typography>
                    </Box>
                    <Typography variant="body1">
                      {formatDate(currentBooking.createdAt)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {currentBooking.specialRequests && (
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Special Requests:
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, backgroundColor: "grey.50" }}
                  >
                    <Typography variant="body1" whiteSpace="pre-line">
                      {currentBooking.specialRequests}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Add Payment Details Section */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardHeader
              title="Payment Details"
              avatar={
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <ReceiptIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              {currentBooking.payments && currentBooking.payments.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Payment ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentBooking.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.id}</TableCell>
                          <TableCell>{formatDate(payment.createdAt)}</TableCell>
                          <TableCell>
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            {payment.paymentMethod || "N/A"}
                          </TableCell>
                          <TableCell>{getStatusChip(payment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box p={3} textAlign="center">
                  <Typography color="text.secondary">
                    No payment records found for this booking.
                  </Typography>
                </Box>
              )}

              {/* Payment Summary */}
              <Box mt={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        color="primary.main"
                      >
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          Total Amount
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {formatCurrency(currentBooking.service.price)}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        color="success.main"
                      >
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          Amount Received
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {formatCurrency(
                          currentBooking.payments
                            ?.filter((p) => p.status === "COMPLETED")
                            ?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
                        )}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        color="warning.main"
                      >
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          Amount Pending
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {formatCurrency(
                          currentBooking.payments
                            ?.filter((p) => p.status === "PENDING")
                            ?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
                        )}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        color={
                          currentBooking.payments &&
                          currentBooking.payments.some(
                            (p) => p.status === "COMPLETED"
                          )
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          Payment Status
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {currentBooking.payments &&
                        currentBooking.payments.some(
                          (p) => p.status === "COMPLETED"
                        )
                          ? "Paid"
                          : "Unpaid"}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        {currentBooking.status === "PENDING" && (
          <>
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Confirm Booking
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelClick}
            >
              Cancel Booking
            </Button>
          </>
        )}
        {currentBooking.status === "CONFIRMED" && (
          <Button variant="contained" color="success" onClick={handleComplete}>
            Mark as Completed
          </Button>
        )}
      </Box>

      {/* Cancellation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for cancelling this booking. The client will
            be notified.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Cancellation Reason"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={!cancellationReason.trim()}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat Dialog */}
      {currentBooking && (
        <ChatDialog
          open={chatDialogOpen}
          onClose={() => setChatDialogOpen(false)}
          clientId={currentBooking.client.userId}
          clientName={`${currentBooking.client.user.firstName} ${currentBooking.client.user.lastName}`}
          clientAvatar={currentBooking.client.user.avatar}
        />
      )}
    </Box>
  );
};

export default BookingDetail;
