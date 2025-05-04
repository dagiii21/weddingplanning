import { useState, useEffect, useCallback } from "react";
import { clientService } from "../services/api";
import { toast } from "react-toastify";

/**
 * Custom hook for fetching and managing client bookings
 *
 * @param {Object} initialParams - Initial pagination and filtering parameters
 * @returns {Object} Bookings data, loading state, and methods to manage bookings
 */
const useClientBookings = (initialParams = { page: 1, limit: 10 }) => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialParams.page,
    limit: initialParams.limit,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchBookings = useCallback(
    async (queryParams = params) => {
      setLoading(true);
      try {
        const response = await clientService.getBookings(queryParams);
        setBookings(response.data.bookings || []);
        setPagination(
          response.data.pagination || {
            total: response.data.bookings?.length || 0,
            page: queryParams.page,
            limit: queryParams.limit,
            totalPages: Math.ceil(
              (response.data.bookings?.length || 0) / queryParams.limit
            ),
          }
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Failed to load bookings");
        toast.error("Could not load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  // Load bookings on component mount and when params change
  useEffect(() => {
    fetchBookings();
  }, [params, fetchBookings]);

  // Change page
  const changePage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  // Change items per page
  const changeLimit = (limit) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  };

  // Filter bookings
  const filterBookings = (filterParams) => {
    setParams((prev) => ({ ...prev, page: 1, ...filterParams }));
  };

  // Return values and methods to use in components
  return {
    bookings,
    pagination,
    loading,
    error,
    changePage,
    changeLimit,
    filterBookings,
    refetch: () => fetchBookings(params),
  };
};

export default useClientBookings;
