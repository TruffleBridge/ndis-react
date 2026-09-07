import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
});

// Add token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Important:
    // Do not set Content-Type here.
    // Browser will set multipart boundary for FormData.
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;