import { fetchUtils } from "react-admin";
import { API_BASE_URL } from "../../config/env";

const apiUrl = API_BASE_URL;
const httpClient = fetchUtils.fetchJson;

// Helper to get the appropriate API path based on resource and user role
const getApiPath = (resource, userRole) => {
  // Default paths for admin role
  const paths = {
    "event-planner": "admin/event-planners",
    vendor: "admin/vendors",
    user: "admin/clients",
    feedback: "admin/feedback",
    payment: "admin/payments",
    dashboard: "admin/dashboard",
    bookings: "vendor/bookings",
    Mangeservices: "vendor/services",
    payments: "client/payment",
    password: "client/account",
    "my-bookings": "client/bookings",
    services: "client/services",
    account: "client/account",
  };

  // Override paths based on user role
  if (userRole === "EVENT_PLANNER") {
    const eventPlannerPaths = {
      vendor: "eventplanner/vendors",
      user: "eventplanner/clients",
      feedback: "eventplanner/feedback",
      payment: "eventplanner/payments",
      dashboard: "eventplanner/dashboard",
    };
    return eventPlannerPaths[resource] || paths[resource];
  }

  if (userRole === "VENDOR") {
    const vendorPaths = {
      dashboard: "vendor/dashboard",
      bookings: "vendor/bookings",
      Mangeservices: "vendor/services",
      payments: "vendor/payment",
      account: "vendor/account",
    };
    return vendorPaths[resource] || paths[resource];
  }

  if (userRole === "CLIENT") {
    const clientPaths = {
      dashboard: "client/dashboard",
      "my-bookings": "client/bookings",
      payments: "client/payment",
      account: "client/account",
      services: "client/services",
    };
    return clientPaths[resource] || paths[resource];
  }

  return paths[resource];
};

const convertRESTRequestToHTTP = (type, resource, params) => {
  try {
    const userRole = sessionStorage.getItem("userRole");
    const token = sessionStorage.getItem("token");

    if (!token) {
      return Promise.reject(new Error("No authentication token found"));
    }

    const options = {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    };

    const apiPath = getApiPath(resource, userRole);

    if (!apiPath) {
      return Promise.reject(new Error(`Unknown resource: ${resource}`));
    }

    let url = `${apiUrl}/${apiPath}`;

    switch (type) {
      case "GET_LIST": {
        const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
        const { field, order } = params.sort || { field: "id", order: "DESC" };
        const start = (page - 1) * perPage;
        const end = page * perPage;

        // Build query parameters
        const query = {
          _start: start,
          _end: end,
          _sort: field,
          _order: order,
          ...params.filter,
        };

        // Convert query object to URL parameters
        const queryString = Object.keys(query)
          .map((key) => key + "=" + encodeURIComponent(query[key]))
          .join("&");

        url = `${url}?${queryString}`;

        return { url, options: { ...options, method: "GET" } };
      }
      case "GET_ONE":
        return {
          url: `${url}/${params.id}`,
          options: { ...options, method: "GET" },
        };
      case "GET_MANY": {
        const query = params.ids.map((id) => `id=${id}`).join("&");
        return {
          url: `${url}?${query}`,
          options: { ...options, method: "GET" },
        };
      }
      case "GET_MANY_REFERENCE": {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const start = (page - 1) * perPage;
        const end = page * perPage;

        const query = {
          _start: start,
          _end: end,
          _sort: field,
          _order: order,
          ...params.filter,
          [params.target]: params.id,
        };

        const queryString = Object.keys(query)
          .map((key) => key + "=" + encodeURIComponent(query[key]))
          .join("&");

        return {
          url: `${url}?${queryString}`,
          options: { ...options, method: "GET" },
        };
      }
      case "CREATE":
        return {
          url,
          options: {
            ...options,
            method: "POST",
            body: JSON.stringify(params.data),
          },
        };
      case "UPDATE":
        return {
          url: `${url}/${params.id}`,
          options: {
            ...options,
            method: resource === "event-planner" ? "PATCH" : "PUT",
            body: JSON.stringify(params.data),
          },
        };
      case "DELETE":
        return {
          url: `${url}/${params.id}`,
          options: { ...options, method: "DELETE" },
        };
      default:
        return Promise.reject(
          new Error(`Unsupported fetch action type ${type}`)
        );
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const convertHTTPResponseToDataProvider = (
  response,
  type,
  resource,
  params
) => {
  const { json } = response;

  switch (type) {
    case "GET_LIST":
    case "GET_MANY_REFERENCE":
      if (!response.headers.has("x-total-count")) {
        console.warn(
          `The X-Total-Count header is missing in the HTTP Response for ${resource}. Using fallback.`
        );
        // Fallback - use the length of the returned array
        return {
          data: json,
          total: Array.isArray(json) ? json.length : 0,
        };
      }

      return {
        data: json,
        total: parseInt(response.headers.get("x-total-count"), 10),
      };
    case "CREATE":
      return { data: { ...params.data, id: json.id } };
    default:
      return { data: json };
  }
};

export default {
  getList: (resource, params) => {
    try {
      const request = convertRESTRequestToHTTP("GET_LIST", resource, params);

      if (request instanceof Promise) {
        return request; // This is a rejected promise from convertRESTRequestToHTTP
      }

      return httpClient(request.url, request.options)
        .then((response) =>
          convertHTTPResponseToDataProvider(
            response,
            "GET_LIST",
            resource,
            params
          )
        )
        .catch((error) => {
          console.error(`Error in getList for ${resource}:`, error);
          return Promise.reject(error);
        });
    } catch (error) {
      console.error(`Error in getList for ${resource}:`, error);
      return Promise.reject(error);
    }
  },
  getOne: (resource, params) => {
    try {
      const request = convertRESTRequestToHTTP("GET_ONE", resource, params);

      if (request instanceof Promise) {
        return request;
      }

      return httpClient(request.url, request.options)
        .then((response) =>
          convertHTTPResponseToDataProvider(
            response,
            "GET_ONE",
            resource,
            params
          )
        )
        .catch((error) => {
          console.error(`Error in getOne for ${resource}:`, error);
          return Promise.reject(error);
        });
    } catch (error) {
      console.error(`Error in getOne for ${resource}:`, error);
      return Promise.reject(error);
    }
  },
  getMany: (resource, params) => {
    try {
      const request = convertRESTRequestToHTTP("GET_MANY", resource, params);

      if (request instanceof Promise) {
        return request;
      }

      return httpClient(request.url, request.options)
        .then((response) =>
          convertHTTPResponseToDataProvider(
            response,
            "GET_MANY",
            resource,
            params
          )
        )
        .catch((error) => {
          console.error(`Error in getMany for ${resource}:`, error);
          return Promise.reject(error);
        });
    } catch (error) {
      console.error(`Error in getMany for ${resource}:`, error);
      return Promise.reject(error);
    }
  },
  getManyReference: (resource, params) => {
    try {
      const request = convertRESTRequestToHTTP(
        "GET_MANY_REFERENCE",
        resource,
        params
      );

      if (request instanceof Promise) {
        return request;
      }

      return httpClient(request.url, request.options)
        .then((response) =>
          convertHTTPResponseToDataProvider(
            response,
            "GET_MANY_REFERENCE",
            resource,
            params
          )
        )
        .catch((error) => {
          console.error(`Error in getManyReference for ${resource}:`, error);
          return Promise.reject(error);
        });
    } catch (error) {
      console.error(`Error in getManyReference for ${resource}:`, error);
      return Promise.reject(error);
    }
  },
  create: (resource, params) => {
    try {
      const request = convertRESTRequestToHTTP("CREATE", resource, params);

      if (request instanceof Promise) {
        return request;
      }

      return httpClient(request.url, request.options)
        .then((response) =>
          convertHTTPResponseToDataProvider(
            response,
            "CREATE",
            resource,
            params
          )
        )
        .catch((error) => {
          console.error(`Error in create for ${resource}:`, error);
          return Promise.reject(error);
        });
    } catch (error) {
      console.error(`Error in create for ${resource}:`, error);
      return Promise.reject(error);
    }
  },
  update: (resource, params) => {
    try {
      const request = convertRESTRequestToHTTP("UPDATE", resource, params);

      if (request instanceof Promise) {
        return request;
      }

      return httpClient(request.url, request.options)
        .then((response) =>
          convertHTTPResponseToDataProvider(
            response,
            "UPDATE",
            resource,
            params
          )
        )
        .catch((error) => {
          console.error(`Error in update for ${resource}:`, error);
          return Promise.reject(error);
        });
    } catch (error) {
      console.error(`Error in update for ${resource}:`, error);
      return Promise.reject(error);
    }
  },
  delete: (resource, params) => {
    try {
      const request = convertRESTRequestToHTTP("DELETE", resource, params);

      if (request instanceof Promise) {
        return request;
      }

      return httpClient(request.url, request.options)
        .then((response) =>
          convertHTTPResponseToDataProvider(
            response,
            "DELETE",
            resource,
            params
          )
        )
        .catch((error) => {
          console.error(`Error in delete for ${resource}:`, error);
          return Promise.reject(error);
        });
    } catch (error) {
      console.error(`Error in delete for ${resource}:`, error);
      return Promise.reject(error);
    }
  },
  deleteMany: (resource, params) => {
    try {
      const userRole = sessionStorage.getItem("userRole");
      const token = sessionStorage.getItem("token");

      if (!token) {
        return Promise.reject(new Error("No authentication token found"));
      }

      const apiPath = getApiPath(resource, userRole);

      if (!apiPath) {
        return Promise.reject(new Error(`Unknown resource: ${resource}`));
      }

      return Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${apiPath}/${id}`, {
            method: "DELETE",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }),
          }).catch((error) => {
            console.error(`Error deleting ${resource} with id ${id}:`, error);
            return Promise.reject(error);
          })
        )
      )
        .then((responses) => ({ data: responses.map(({ json }) => json.id) }))
        .catch((error) => {
          console.error(`Error in deleteMany for ${resource}:`, error);
          return Promise.reject(error);
        });
    } catch (error) {
      console.error(`Error in deleteMany for ${resource}:`, error);
      return Promise.reject(error);
    }
  },
};
