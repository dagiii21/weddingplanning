import { useState, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const useVendorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Fetch all bookings with optional filtering
  const fetchBookings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      // Add all params to query string
      if (params.status) queryParams.append("status", params.status);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      const response = await api.get(
        `/vendor/bookings?${queryParams.toString()}`
      );

      // Get bookings from the correct response property
      const bookingsData = response.data.data || [];
      setBookings(bookingsData);

      // Make sure pagination exists before setting it
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Failed to fetch bookings");
      toast.error("Could not load bookings. Please try again.");
      // Set empty bookings array on error
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single booking by ID
  const fetchBookingById = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      const response = await api.get(`/vendor/bookings/${bookingId}`);
      setCurrentBooking(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError(err.message || "Failed to fetch booking details");
      toast.error("Could not load booking details. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirm a booking
  const confirmBooking = useCallback(
    async (bookingId) => {
      try {
        setLoading(true);
        const response = await api.patch(
          `/vendor/bookings/${bookingId}/confirm`
        );

        // Update bookings list if the booking exists there
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "CONFIRMED" }
              : booking
          )
        );

        // Update current booking if it's the one being confirmed
        if (currentBooking?.id === bookingId) {
          setCurrentBooking({ ...currentBooking, status: "CONFIRMED" });
        }

        toast.success("Booking confirmed successfully");
        return response.data;
      } catch (err) {
        console.error("Error confirming booking:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to confirm booking";
        toast.error(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentBooking]
  );

  // Cancel a booking
  const cancelBooking = useCallback(
    async (bookingId, cancellationReason) => {
      try {
        setLoading(true);
        const response = await api.patch(
          `/vendor/bookings/${bookingId}/cancel`,
          {
            cancellationReason,
          }
        );

        // Update bookings list if the booking exists there
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "CANCELLED" }
              : booking
          )
        );

        // Update current booking if it's the one being cancelled
        if (currentBooking?.id === bookingId) {
          setCurrentBooking({ ...currentBooking, status: "CANCELLED" });
        }

        toast.success("Booking cancelled successfully");
        return response.data;
      } catch (err) {
        console.error("Error cancelling booking:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to cancel booking";
        toast.error(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentBooking]
  );

  // Complete a booking
  const completeBooking = useCallback(
    async (bookingId) => {
      try {
        setLoading(true);
        const response = await api.patch(
          `/vendor/bookings/${bookingId}/complete`
        );

        // Update bookings list if the booking exists there
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "COMPLETED" }
              : booking
          )
        );

        // Update current booking if it's the one being completed
        if (currentBooking?.id === bookingId) {
          setCurrentBooking({ ...currentBooking, status: "COMPLETED" });
        }

        toast.success("Booking marked as completed successfully");
        return response.data;
      } catch (err) {
        console.error("Error completing booking:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to complete booking";
        toast.error(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentBooking]
  );

  return {
    bookings,
    currentBooking,
    loading,
    error,
    pagination,
    fetchBookings,
    fetchBookingById,
    confirmBooking,
    cancelBooking,
    completeBooking,
  };
};

export default useVendorBookings;
