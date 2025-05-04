import api from "../../services/api";
import { vendorService } from "../../services/api";
import { API_URL } from "../../config/api.config";

/**
 * Data Provider for react-admin that connects to our real API
 * This replaces the test data provider with real API calls
 */
const apiDataProvider = {
  getList: (resource, params) => {
    // Special case for vendor payments dashboard
    if (resource === "payments") {
      return vendorService.getPayments().then((response) => {
        if (!response.data || !response.data.success) {
          return { data: [], total: 0 };
        }

        // Combine received and pending payments for the list
        const receivedPayments = response.data.data.receivedPayments || [];
        const pendingPayments = response.data.data.pendingPayments || [];

        // Add a type field to each payment to identify it
        const allPayments = [
          ...receivedPayments.map((payment) => ({
            ...payment,
            type: "received",
          })),
          ...pendingPayments.map((payment) => ({
            ...payment,
            type: "pending",
          })),
        ];

        return {
          data: allPayments,
          total: allPayments.length,
          // Include the summary data for use in the dashboard
          summary: {
            totalPayments: response.data.data.totalPayments || 0,
            receivedPaymentsCount: receivedPayments.length,
            pendingPaymentsCount: pendingPayments.length,
            vendorId: response.data.data.vendorId,
          },
        };
      });
    }

    // Default behavior for other resources
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      ...params.filter,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    };

    const url = `${resource}`;

    return api.get(url, { params: query }).then((response) => {
      return {
        data: response.data.items || response.data,
        total: response.data.total || response.data.length,
      };
    });
  },

  getOne: (resource, params) => {
    return api.get(`${resource}/${params.id}`).then((response) => ({
      data: response.data,
    }));
  },

  getMany: (resource, params) => {
    const query = {
      id: params.ids,
    };

    return api.get(`${resource}`, { params: query }).then((response) => ({
      data: response.data,
    }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const query = {
      ...params.filter,
      [params.target]: params.id,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    };

    return api.get(`${resource}`, { params: query }).then((response) => ({
      data: response.data.items || response.data,
      total: response.data.total || response.data.length,
    }));
  },

  create: (resource, params) => {
    return api.post(`${resource}`, params.data).then((response) => ({
      data: { ...params.data, id: response.data.id },
    }));
  },

  update: (resource, params) => {
    return api
      .put(`${resource}/${params.id}`, params.data)
      .then((response) => ({
        data: response.data,
      }));
  },

  updateMany: (resource, params) => {
    const promises = params.ids.map((id) =>
      api.put(`${resource}/${id}`, params.data)
    );

    return Promise.all(promises).then(() => ({ data: params.ids }));
  },

  delete: (resource, params) => {
    return api
      .delete(`${resource}/${params.id}`)
      .then(() => ({ data: params.previousData }));
  },

  deleteMany: (resource, params) => {
    const promises = params.ids.map((id) => api.delete(`${resource}/${id}`));
    return Promise.all(promises).then(() => ({ data: params.ids }));
  },
};

export default apiDataProvider;
