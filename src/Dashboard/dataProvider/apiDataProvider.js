import { fetchUtils } from "react-admin";

const apiUrl = "http://localhost:5000/api";
const httpClient = fetchUtils.fetchJson;

// Helper to get the appropriate API path based on resource and user role
const getApiPath = (resource, userRole) => {
  // Default paths for admin role
  const paths = {
    "event-planner": "admin/event-planners",
    vendor: "admin/vendors",
    user: "admin/clients",
    feedback: "admin/feedback",
    payemnt: "admin/payments",
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
      payemnt: "eventplanner/payments",
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
  const userRole = sessionStorage.getItem("userRole");
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const options = {
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  };

  const apiPath = getApiPath(resource, userRole);

  if (!apiPath) {
    throw new Error(`Unknown resource: ${resource}`);
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
      throw new Error(`Unsupported fetch action type ${type}`);
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
    const request = convertRESTRequestToHTTP("GET_LIST", resource, params);
    return httpClient(request.url, request.options).then((response) =>
      convertHTTPResponseToDataProvider(response, "GET_LIST", resource, params)
    );
  },
  getOne: (resource, params) => {
    const request = convertRESTRequestToHTTP("GET_ONE", resource, params);
    return httpClient(request.url, request.options).then((response) =>
      convertHTTPResponseToDataProvider(response, "GET_ONE", resource, params)
    );
  },
  getMany: (resource, params) => {
    const request = convertRESTRequestToHTTP("GET_MANY", resource, params);
    return httpClient(request.url, request.options).then((response) =>
      convertHTTPResponseToDataProvider(response, "GET_MANY", resource, params)
    );
  },
  getManyReference: (resource, params) => {
    const request = convertRESTRequestToHTTP(
      "GET_MANY_REFERENCE",
      resource,
      params
    );
    return httpClient(request.url, request.options).then((response) =>
      convertHTTPResponseToDataProvider(
        response,
        "GET_MANY_REFERENCE",
        resource,
        params
      )
    );
  },
  create: (resource, params) => {
    const request = convertRESTRequestToHTTP("CREATE", resource, params);
    return httpClient(request.url, request.options).then((response) =>
      convertHTTPResponseToDataProvider(response, "CREATE", resource, params)
    );
  },
  update: (resource, params) => {
    const request = convertRESTRequestToHTTP("UPDATE", resource, params);
    return httpClient(request.url, request.options).then((response) =>
      convertHTTPResponseToDataProvider(response, "UPDATE", resource, params)
    );
  },
  delete: (resource, params) => {
    const request = convertRESTRequestToHTTP("DELETE", resource, params);
    return httpClient(request.url, request.options).then((response) =>
      convertHTTPResponseToDataProvider(response, "DELETE", resource, params)
    );
  },
  deleteMany: (resource, params) => {
    // Implementation depends on your API. Here's a simple option:
    return Promise.all(
      params.ids.map((id) =>
        httpClient(
          `${apiUrl}/${getApiPath(
            resource,
            sessionStorage.getItem("userRole")
          )}/${id}`,
          {
            method: "DELETE",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            }),
          }
        )
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) }));
  },
};
