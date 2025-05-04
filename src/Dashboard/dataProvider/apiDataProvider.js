import api from "../../services/api";
import { vendorService } from "../../services/api";
import { API_URL } from "../../config/api.config";

// Map React-Admin resource names to backend endpoints
const resourceMap = {
  dashboard: "/admin/dashboard/overview",
  "event-planner": "/admin/event-planners",
  user: "/admin/clients",
  vendor: "/admin/vendors",
  payemnt: "/admin/payments",
  feedback: "/admin/feedback",
  password: "/admin/clients", // special handling below
};

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
    const endpoint = resourceMap[resource] || `/${resource}`;
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: "id", order: "ASC" };
    const query = {
      ...params.filter,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    };
    return api.get(endpoint, { params: query }).then((response) => {
      // If response is array, fake total
      if (Array.isArray(response.data)) {
        return { data: response.data, total: response.data.length };
      }
      // If response is object with items/total
      return {
        data: response.data.items || response.data,
        total: response.data.total || response.data.length || 0,
      };
    });
  },

  getOne: (resource, params) => {
    const endpoint = resourceMap[resource] || `/${resource}`;
    return api.get(`${endpoint}/${params.id}`).then((response) => ({
      data: response.data,
    }));
  },

  getMany: (resource, params) => {
    const endpoint = resourceMap[resource] || `/${resource}`;
    return api
      .get(endpoint, { params: { id: params.ids } })
      .then((response) => ({
        data: response.data,
      }));
  },

  getManyReference: (resource, params) => {
    const endpoint = resourceMap[resource] || `/${resource}`;
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
    return api.get(endpoint, { params: query }).then((response) => ({
      data: response.data.items || response.data,
      total: response.data.total || response.data.length,
    }));
  },

  create: (resource, params) => {
    const endpoint = resourceMap[resource] || `/${resource}`;
    // Special case: event-planner create expects { email, password, firstName, lastName, phone }
    return api.post(endpoint, params.data).then((response) => ({
      data: response.data,
    }));
  },

  update: (resource, params) => {
    const endpoint = resourceMap[resource] || `/${resource}`;
    // Special PATCH for event-planner and vendor
    if (resource === "event-planner") {
      return api
        .patch(`${endpoint}/${params.id}`, params.data)
        .then((response) => ({
          data: response.data,
        }));
    }
    if (resource === "vendor") {
      return api
        .patch(`${endpoint}/${params.id}`, params.data)
        .then((response) => ({
          data: response.data,
        }));
    }
    // Special: password change
    if (resource === "password") {
      // params.data: { id, password }
      return api
        .patch(`/admin/clients/${params.data.id}/password`, {
          password: params.data.password,
        })
        .then((response) => ({
          data: response.data,
        }));
    }
    // Default PUT
    return api
      .put(`${endpoint}/${params.id}`, params.data)
      .then((response) => ({
        data: response.data,
      }));
  },

  updateMany: (resource, params) => {
    const endpoint = resourceMap[resource] || `/${resource}`;
    const promises = params.ids.map((id) =>
      api.put(`${endpoint}/${id}`, params.data)
    );
    return Promise.all(promises).then(() => ({ data: params.ids }));
  },

  delete: (resource, params) => {
    const endpoint = resourceMap[resource] || `/${resource}`;
    return api
      .delete(`${endpoint}/${params.id}`)
      .then(() => ({ data: params.previousData }));
  },

  deleteMany: (resource, params) => {
    const endpoint = resourceMap[resource] || `/${resource}`;
    const promises = params.ids.map((id) => api.delete(`${endpoint}/${id}`));
    return Promise.all(promises).then(() => ({ data: params.ids }));
  },
};

export default apiDataProvider;
