// Centralized API setup
import axios from "axios";
import qs from "qs";

// Backend URL
const backendURL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

console.log("ENV Connection string established at:", backendURL);

// Create Axios instance
const api = axios.create({
  baseURL: `${backendURL}/api`,
  withCredentials: true,
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: "repeat" }),
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;