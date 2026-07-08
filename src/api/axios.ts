import axios from "axios";

// base url from the env
const base_url = import.meta.env.VITE_API_URL; 
const axiosInstance = axios.create({
    baseURL: base_url,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;