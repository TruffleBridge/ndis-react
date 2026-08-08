import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://52.66.162.16/api",
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