// centralized API setup
import axios from "axios";
import qs from "qs";

// If VITE_API_URL is undefined, automatically fall back to your local port 4000
const backendURL = import.meta.env.VITE_API_URL || "http://localhost:4000";
console.log("ENV Connection string established at:", backendURL);

const api = axios.create({
  baseURL: `${backendURL}/api`,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

export default api;