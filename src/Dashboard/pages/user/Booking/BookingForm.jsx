import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  Skeleton,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-toastify";
import { clientService } from "../../../../services/api";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import MessageIcon from "@mui/icons-material/Message";

const BookingForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tierId = searchParams.get("tierId");

  // Service data state
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  // Form state
  const [bookingDate, setBookingDate] = useState(null);
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState(50);
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Initialize with tomorrow's date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0); // Set to noon
    setBookingDate(tomorrow);
  }, []);

  // Get category color for chip
  const getCategoryColor = (category) => {
    if (!category) return "#4caf50";

    switch (category.toLowerCase()) {
      case "platinum":
        return "#1a237e"; // Dark blue
      case "gold":
      case "golden":
        return "#ff9800"; // Gold
      case "silver":
        return "#757575"; // Silver
      case "bronze":
        return "#cd7f32"; // Bronze
      default:
        return "#4caf50"; // Green for others
    }
  };

  // Format category text for display
  const formatCategory = (text) => {
    if (!text) return "Standard";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      try {
        // Get individual service by ID using API
        const response = await clientService.getServices({ id: serviceId });

        // Find the service in the response data
        let foundService = null;
        if (response.data?.services && Array.isArray(response.data.services)) {
          foundService = response.data.services.find((s) => s.id === serviceId);
        }

        if (foundService) {
          setService(foundService);

          // Find the tier if tierId is provided
          if (tierId && foundService.tiers && foundService.tiers.length > 0) {
            const tier = foundService.tiers.find((t) => t.id === tierId);
            if (tier) {
              setSelectedTier(tier);
            }
          }

          setError(null);
        } else {
          setError("Service not found");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err.message || "Failed to load service details");
        toast.error("Could not load service details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId, tierId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (!bookingDate) {
      toast.error("Please select an event date");
      return;
    }

    // Check if date is at least tomorrow
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (bookingDate <= today) {
      toast.error("Event date must be at least tomorrow or later");
      return;
    }

    if (!location) {
      toast.error("Please enter an event location");
      return;
    }

    // Check if tier is selected when service has tiers
    if (service.tiers && service.tiers.length > 0 && !selectedTier && !tierId) {
      toast.error("Please select a service tier");
      navigate(`/dashboard/services?highlight=${service.id}`);
      return;
    }

    setBookingLoading(true);
    try {
      // Create booking data object
      const bookingData = {
        serviceId: service.id,
        eventDate: bookingDate.toISOString(),
        location,
        attendees,
        specialRequests,
      };

      // Add tier information if available
      if (selectedTier) {
        bookingData.serviceTierPriceId = selectedTier.id;
        bookingData.selectedTier = selectedTier.tier;
      } else if (tierId && service.tiers) {
        // Find tier by ID if not already set
        const tier = service.tiers.find((t) => t.id === tierId);
        if (tier) {
          bookingData.serviceTierPriceId = tier.id;
          bookingData.selectedTier = tier.tier;
        }
      }

      // Final validation for required fields
      if (!bookingData.serviceTierPriceId || !bookingData.selectedTier) {
        setBookingLoading(false);
        toast.error(
          "Service tier information is missing. Please select a service tier."
        );
        return;
      }

      // Create the booking using the API
      const response = await clientService.createBooking(bookingData);

      // Show success message
      toast.success("Service booked successfully!");

      // Get booking data from response
      const booking = response.data.booking;

      // Initiate payment after successful booking
      await initiatePaymentForBooking(booking);
    } catch (error) {
      console.error("Error creating booking:", error);

      // Improved error message
      const errorMessage =
        error.response?.data?.message || "Failed to book service";
      toast.error(errorMessage);
      setBookingLoading(false);
    }
  };

  // Handle payment initiation
  const initiatePaymentForBooking = async (booking) => {
    setPaymentLoading(true);
    try {
      // Get user data
      const userData = JSON.parse(
        localStorage.getItem("userData") ||
          sessionStorage.getItem("userData") ||
          "{}"
      );

      // Prepare payment data with all required fields
      const paymentData = {
        amount: selectedTier
          ? selectedTier.price
          : booking.amount || service.price || service.basePrice,
        vendorId: booking.vendorId || service.vendor.id,
        bookingId: booking.id,
        userId: userData.id, // Add the userId required by the backend
      };

      // Call payment initiation API
      const paymentResponse = await clientService.initiatePayment(paymentData);

      // Get checkout URL from response
      const { checkoutUrl } = paymentResponse.data;

      // Show payment notification
      toast.info("Redirecting to payment page...");

      // Redirect to Chapa checkout page
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to process payment. Redirecting to bookings page."
      );

      // Redirect to bookings page if payment initiation fails
      setTimeout(() => {
        navigate("/dashboard/my-bookings");
      }, 1500);
    } finally {
      setBookingLoading(false);
      setPaymentLoading(false);
    }
  };

  // Combined loading state for booking and payment
  const isProcessing = bookingLoading || paymentLoading;
  const buttonText = paymentLoading
    ? "Processing Payment..."
    : bookingLoading
    ? "Processing Booking..."
    : "Book & Proceed to Payment";

  // Handle back button click
  const handleBack = () => {
    navigate("/dashboard/services");
  };

  if (loading) {
    return (
      <Box p={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Services
        </Button>

        <Skeleton variant="rectangular" height={250} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={60} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !service) {
    return (
      <Box p={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Services
        </Button>

        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Service not found. Please try selecting another service."}
        </Alert>

        <Button variant="contained" onClick={handleBack} color="primary">
          Browse Available Services
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 3 }}>
        Back to Services
      </Button>

      {/* Service Details Card */}
      <Paper elevation={2} sx={{ mb: 4, overflow: "hidden" }}>
        <Grid container>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="div"
              sx={{
                height: { xs: 200, md: "100%" },
                minHeight: { md: 300 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0, 0, 0, 0.04)",
              }}
            >
              <PhotoCameraIcon
                sx={{ fontSize: 80, color: "rgba(0, 0, 0, 0.2)" }}
              />
            </CardMedia>
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="flex-start"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  fontWeight="bold"
                >
                  {service.name}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Rating
                  value={service.vendor?.rating || 0}
                  readOnly
                  precision={0.5}
                />
                <Typography variant="body2" color="text.secondary" ml={1}>
                  ({service.vendor?.rating?.toFixed(1) || "0.0"})
                </Typography>
              </Box>

              <Typography
                variant="h5"
                color="primary.main"
                fontWeight="bold"
                my={2}
              >
                {selectedTier ? (
                  <>
                    ETB {selectedTier.price?.toLocaleString()}{" "}
                    <span style={{ fontSize: "0.8em" }}>
                      (
                      {selectedTier.tier.charAt(0) +
                        selectedTier.tier.slice(1).toLowerCase()}{" "}
                      tier)
                    </span>
                  </>
                ) : (
                  <>ETB {service.price?.toLocaleString()}</>
                )}
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                {service.description}
              </Typography>

              {selectedTier && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Selected tier:{" "}
                    <strong>
                      {selectedTier.tier.charAt(0) +
                        selectedTier.tier.slice(1).toLowerCase()}
                    </strong>{" "}
                    - {selectedTier.description}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="medium">
                Provided by{" "}
                <Typography
                  component="span"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {service.vendor?.businessName}
                </Typography>
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Paper>

      {/* Booking Form */}
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        Book This Service
      </Typography>

      <Paper elevation={1} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Event Date *"
                  value={bookingDate}
                  onChange={(newDate) => setBookingDate(newDate)}
                  format="PPP"
                  disablePast
                  minDate={
                    new Date(new Date().setDate(new Date().getDate() + 1))
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText:
                        "Event date must be at least tomorrow or later",
                      InputProps: {
                        startAdornment: (
                          <EventIcon color="action" sx={{ mr: 1 }} />
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Location *"
                fullWidth
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                helperText="Enter the event location"
                InputProps={{
                  startAdornment: (
                    <LocationOnIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Number of Attendees"
                fullWidth
                type="number"
                InputProps={{
                  inputProps: { min: 1 },
                  startAdornment: <PeopleIcon color="action" sx={{ mr: 1 }} />,
                }}
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                helperText="Estimated number of attendees"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Special Requests"
                fullWidth
                multiline
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                helperText="Any special requests or requirements"
                InputProps={{
                  startAdornment: (
                    <MessageIcon
                      color="action"
                      sx={{ mr: 1, alignSelf: "flex-start", mt: 1 }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    By booking, you agree to our terms and conditions
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!bookingDate || !location || isProcessing}
                  startIcon={
                    isProcessing ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <BookOnlineIcon />
                    )
                  }
                >
                  {buttonText}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default BookingForm;
