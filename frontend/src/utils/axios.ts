import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",  // Base URL for your API
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");  // Get token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;  // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
