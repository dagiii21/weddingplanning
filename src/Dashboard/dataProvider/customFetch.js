/**
 * Custom fetch utilities that properly handle authentication and headers
 * for both standard React Admin components and custom components
 */

import { API_URL } from "../../config/api.config";

/**
 * Custom fetch with authentication
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch response
 */
export const authFetch = async (url, options = {}) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // Fix the URL duplication issue - ensure we don't have /api/api/
  const fullUrl = url.startsWith("http")
    ? url
    : url.startsWith("/api/")
    ? `${API_URL.replace(/\/api$/, "")}${url}`
    : `${API_URL}${url}`;

  console.log(`Fetching: ${fullUrl}`);

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  return response;
};

/**
 * Handle API response with proper error handling
 * @param {Response} response - Fetch response object
 * @returns {Object} - Parsed response data
 */
export const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || `Error: ${response.status}`;
    } catch (e) {
      errorMessage = `Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  // Check if the response is empty
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return { data: null };
  }

  const data = await response.json();
  return { data, headers: response.headers };
};

/**
 * Fetch data with pagination support
 * @param {string} url - Base URL
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with data and pagination info
 */
export const fetchWithPagination = async (url, params = {}) => {
  const {
    page = 0,
    perPage = 10,
    sort = "businessName",
    order = "ASC",
    filter = {},
  } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("_start", page * perPage);
  queryParams.append("_end", page * perPage + perPage);
  queryParams.append("_sort", sort);
  queryParams.append("_order", order);

  // Add filters
  Object.entries(filter).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  const response = await authFetch(`${url}?${queryParams.toString()}`);
  const { data } = await handleResponse(response);

  // Get total count from header
  const totalCount = response.headers.get("x-total-count");

  return {
    data,
    total: totalCount ? parseInt(totalCount, 10) : data?.length || 0,
  };
};

/**
 * Fetch a single record by ID
 * @param {string} url - Base URL
 * @param {string} id - Record ID
 * @returns {Promise} - Response with record data
 */
export const fetchById = async (url, id) => {
  const response = await authFetch(`${url}/${id}`);
  const { data } = await handleResponse(response);
  return { data };
};

/**
 * Create a new record
 * @param {string} url - Base URL
 * @param {Object} data - Record data
 * @returns {Promise} - Response with created record
 */
export const createRecord = async (url, data) => {
  const response = await authFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const { data: responseData } = await handleResponse(response);
  return { data: responseData };
};

/**
 * Update a record
 * @param {string} url - Base URL
 * @param {string} id - Record ID
 * @param {Object} data - Updated data
 * @returns {Promise} - Response with updated record
 */
export const updateRecord = async (url, id, data) => {
  const response = await authFetch(`${url}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  const { data: responseData } = await handleResponse(response);
  return { data: responseData };
};

/**
 * Delete a record
 * @param {string} url - Base URL
 * @param {string} id - Record ID
 * @returns {Promise} - Response from deletion
 */
export const deleteRecord = async (url, id) => {
  const response = await authFetch(`${url}/${id}`, {
    method: "DELETE",
  });
  const { data } = await handleResponse(response);
  return { data };
};
