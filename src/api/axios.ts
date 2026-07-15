import axios from "axios";

// base url from the env
// const base_url = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzgzNjU1NTYwLCJleHAiOjE3ODQyNjAzNjB9._paEFkQPANMw3cFA-y0X1LNpnbMHARvmg4Xzpj3qo1c"
    },
});

export default axiosInstance;