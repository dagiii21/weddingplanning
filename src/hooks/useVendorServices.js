import { useState, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const useVendorServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/vendor/services");
      setServices(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch services");
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, []);

  const addService = useCallback(async (serviceData) => {
    try {
      setLoading(true);
      const response = await api.post("/vendor/services", serviceData);
      setServices((prev) => [...prev, response.data.data]);
      toast.success("Service added successfully");
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add service";
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateService = useCallback(async (serviceId, updateData) => {
    try {
      setLoading(true);
      const response = await api.patch(
        `/vendor/services/${serviceId}`,
        updateData
      );
      setServices((prev) =>
        prev.map((service) =>
          service.serviceId === serviceId ? response.data.data : service
        )
      );
      toast.success("Service updated successfully");
      return response.data.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update service";
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteService = useCallback(async (serviceId) => {
    try {
      setLoading(true);
      await api.delete(`/vendor/services/${serviceId}`);
      setServices((prev) =>
        prev.filter((service) => service.serviceId !== serviceId)
      );
      toast.success("Service deleted successfully");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete service";
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    addService,
    updateService,
    deleteService,
  };
};

export default useVendorServices;
