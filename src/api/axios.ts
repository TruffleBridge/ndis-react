import axios from "axios";

// base url from the env
const base_url = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
    baseURL: base_url,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzg0NzA1MzU0LCJleHAiOjE3ODUzMTAxNTR9.8B12r6BjYqMfS4aUJtvWmnRS_fakKXr7LDJ8xa9pdOU"
    },
});

export default axiosInstance;