import { useState, useEffect, useCallback } from "react";
import { clientService } from "../services/api";
import { toast } from "react-toastify";

/**
 * Custom hook for fetching and managing available services
 *
 * @param {Object} initialParams - Initial pagination and filtering parameters
 * @returns {Object} Services data, loading state, and methods to manage services
 */
const useClientServices = (initialParams = { page: 1, limit: 10 }) => {
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialParams.page,
    limit: initialParams.limit,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchServices = useCallback(
    async (queryParams = params) => {
      setLoading(true);
      try {
        const response = await clientService.getServices(queryParams);
        setServices(response.data.services || []);
        setPagination(
          response.data.pagination || {
            total: response.data.services?.length || 0,
            page: queryParams.page,
            limit: queryParams.limit,
            totalPages: Math.ceil(
              (response.data.services?.length || 0) / queryParams.limit
            ),
          }
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message || "Failed to load services");
        toast.error("Could not load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  // Load services on component mount and when params change
  useEffect(() => {
    fetchServices();
  }, [params, fetchServices]);

  // Change page
  const changePage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  // Change items per page
  const changeLimit = (limit) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  };

  // Filter services by category, price range, etc.
  const filterServices = (filterParams) => {
    setParams((prev) => ({ ...prev, page: 1, ...filterParams }));
  };

  // Search services by name
  const searchServices = (query) => {
    setParams((prev) => ({ ...prev, page: 1, search: query }));
  };

  // Return values and methods to use in components
  return {
    services,
    pagination,
    loading,
    error,
    changePage,
    changeLimit,
    filterServices,
    searchServices,
    refetch: () => fetchServices(params),
  };
};

export default useClientServices;
