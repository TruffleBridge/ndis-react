import axios from "axios";

// base url from the env
// const base_url = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
    baseURL: "http://52.66.162.16/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
});

export default axiosInstance;