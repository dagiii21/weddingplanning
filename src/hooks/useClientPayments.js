import { useState, useEffect, useCallback } from "react";
import { clientService } from "../services/api";
import { toast } from "react-toastify";

/**
 * Custom hook for fetching and managing client payments
 *
 * @param {Object} initialParams - Initial pagination and filtering parameters
 * @returns {Object} Payments data, loading state, and methods to manage payments
 */
const useClientPayments = (initialParams = { page: 1, limit: 10 }) => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialParams.page,
    limit: initialParams.limit,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchPayments = useCallback(
    async (queryParams = params) => {
      setLoading(true);
      try {
        const response = await clientService.getPayments(queryParams);
        setPayments(response.data.payments || []);
        setPagination(
          response.data.pagination || {
            total: response.data.payments?.length || 0,
            page: queryParams.page,
            limit: queryParams.limit,
            pages: Math.ceil(
              (response.data.payments?.length || 0) / queryParams.limit
            ),
          }
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to load payments");
        toast.error("Could not load your payments. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  // Load payments on component mount and when params change
  useEffect(() => {
    fetchPayments();
  }, [params, fetchPayments]);

  // Change page
  const changePage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  // Change items per page
  const changeLimit = (limit) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  };

  // Filter payments
  const filterPayments = (filterParams) => {
    setParams((prev) => ({ ...prev, page: 1, ...filterParams }));
  };

  // Return values and methods to use in components
  return {
    payments,
    pagination,
    loading,
    error,
    changePage,
    changeLimit,
    filterPayments,
    refetch: () => fetchPayments(params),
  };
};

export default useClientPayments;
